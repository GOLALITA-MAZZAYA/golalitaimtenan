import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { BALOO_SEMIBOLD } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { globalTixAPI } from '../../redux/globalTix/globalTix-api';
import { SCREEN_HEIGHT } from '../../styles/mainStyles';

const BOOKINGS_STORAGE_KEY = 'globaltix_my_bookings';

const STATUS_COLOR = {
  CONFIRMED: '#2196F3',
  RESERVED:  '#FF9800',
  CANCELLED: '#F44336',
  REDEEMED:  '#4CAF50',
  VALID:     '#4CAF50',
};

const formatDate = (iso) => {
  if (!iso) return null;
  return iso.split('T')[0];
};

const GlobalTixMyBookings = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [bookings, setBookings] = useState([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingRef, setCancellingRef] = useState(null);
  const [expandedRef, setExpandedRef] = useState(null);

  const loadBookings = useCallback(async () => {
    console.log('[GlobalTix][MyBookings][load] loadBookings START');
    try {
      const stored = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const refs = stored ? JSON.parse(stored) : [];
      console.log('[GlobalTix][MyBookings][load] stored refs:', refs);
      if (refs.length === 0) {
        setBookings([]);
        return;
      }

      const uniqueRefs = refs.filter(
        (entry, idx, arr) => arr.findIndex(e => e.referenceNumber === entry.referenceNumber) === idx
      );

      const results = await Promise.all(
        uniqueRefs.map(async (entry) => {
          try {
            const res = await globalTixAPI.getBookingDetails({
              referenceNumber: entry.referenceNumber,
            });
            console.log(`[GlobalTix][MyBookings][load] getBookingDetails(${entry.referenceNumber}) ->`, JSON.stringify(res, null, 2));
            if (res.success && res.data) {
              return { ...entry, details: res.data, fetchError: false };
            }
            return { ...entry, details: null, fetchError: true };
          } catch (err) {
            console.error(`[GlobalTix][MyBookings][load] getBookingDetails(${entry.referenceNumber}) threw:`, err);
            return { ...entry, details: null, fetchError: true };
          }
        })
      );
      console.log('[GlobalTix][MyBookings][load] final bookings list — statuses:',
        results.map(b => ({ ref: b.referenceNumber, status: b.details?.status || b.status, fetchError: b.fetchError })));
      setBookings(results);
    } catch (err) {
      console.error('[GlobalTix][MyBookings][load] Failed to load bookings:', err);
    } finally {
      console.log('[GlobalTix][MyBookings][load] loadBookings END');
      setLoadingRefs(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const onRefresh = () => {
    console.log('[GlobalTix][MyBookings][load] pull-to-refresh triggered');
    setRefreshing(true);
    loadBookings();
  };

  const handleCancel = (referenceNumber, productName) => {
    console.log('[GlobalTix][MyBookings][cancel] Cancel tapped for:', referenceNumber, productName);
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel booking ${referenceNumber}?\n\n${productName}`,
      [
        { text: 'No', style: 'cancel', onPress: () => console.log('[GlobalTix][MyBookings][cancel] User declined cancellation for:', referenceNumber) },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => confirmCancel(referenceNumber),
        },
      ]
    );
  };

  const confirmCancel = async (referenceNumber) => {
    console.log('[GlobalTix][MyBookings][cancel] confirmCancel START — referenceNumber:', referenceNumber);
    setCancellingRef(referenceNumber);
    try {
      const result = await globalTixAPI.cancelBooking({
        transactionRef: referenceNumber,
        remarks: 'Customer cancellation',
      });

      console.log('[GlobalTix][MyBookings][cancel] cancelBooking result:', JSON.stringify(result, null, 2));

      const alreadyCancelled = result.error?.code === 'error.process.cancellation';

      if ((result.success && result.data?.cancellationStatus === 'CANCELLED') || alreadyCancelled) {
        console.log(
          alreadyCancelled
            ? '[GlobalTix][MyBookings][cancel] GlobalTix reports this was already cancelled — syncing local state:'
            : '[GlobalTix][MyBookings][cancel] SUCCESS — marking booking CANCELLED locally:',
          referenceNumber
        );
        Alert.alert('Cancelled', `Booking ${referenceNumber} has been successfully cancelled.`);

        // Update the lightweight local fallback flag (used only when live
        // details haven't loaded yet, e.g. fetchError) and persist it, then
        // re-fetch this booking from GlobalTix so the UI reflects their
        // authoritative ticket status (tickets[0].displayStatus.name) rather
        // than a hand-patched shape that could drift from the real response.
        setBookings(prev =>
          prev.map(b => (b.referenceNumber === referenceNumber ? { ...b, status: 'CANCELLED' } : b))
        );

        try {
          const storedRaw = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
          const storedList = storedRaw ? JSON.parse(storedRaw) : [];
          const updatedList = storedList.map(b =>
            b.referenceNumber === referenceNumber ? { ...b, status: 'CANCELLED' } : b
          );
          await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedList));
          console.log('[GlobalTix][MyBookings][cancel] persisted CANCELLED fallback flag to AsyncStorage for:', referenceNumber);
        } catch (storageErr) {
          console.error('[GlobalTix][MyBookings][cancel] Failed to persist CANCELLED fallback flag:', storageErr);
        }

        loadBookings();
      } else {
        const errMsg =
          result.error?.message ||
          result.error?.errorDetails ||
          (typeof result.error === 'string' ? result.error : null) ||
          'Unable to cancel this booking. Please contact support.';
        console.warn('[GlobalTix][MyBookings][cancel] FAILED:', errMsg, result);
        Alert.alert('Cancellation Failed', errMsg);
      }
    } catch (err) {
      console.error('[GlobalTix][MyBookings][cancel] threw an unexpected error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      console.log('[GlobalTix][MyBookings][cancel] confirmCancel END — referenceNumber:', referenceNumber);
      setCancellingRef(null);
    }
  };

  const renderBooking = ({ item }) => {
    const ref = item.referenceNumber;
    const d = item.details;
    const firstTicket = d?.tickets?.[0];

    // `d.status` (top-level) is the booking/transaction status — it reflects
    // whether the booking was paid/confirmed, and correctly stays CONFIRMED
    // forever even after a ticket is cancelled. Cancellation lives on the
    // TICKET: `tickets[0].status` / `displayStatus`, an enum whose `name` is
    // "REVOKED" once cancelled — confirmed via a real cancelled booking's
    // raw API response. Normalize that to our own "CANCELLED" vocabulary.
    const rawTicketStatusName = firstTicket?.displayStatus?.name || firstTicket?.status?.name;
    const normalizedLiveStatus = rawTicketStatusName === 'REVOKED' ? 'CANCELLED' : rawTicketStatusName;
    const status = normalizedLiveStatus || item.status || 'UNKNOWN';
    const isCancelling = cancellingRef === ref;
    const isExpanded = expandedRef === ref;

    const isCancellable =
      (firstTicket ? firstTicket.cancellationPolicyType === 'CANCELLABLE' : item.isCancellable) &&
      status !== 'CANCELLED' &&
      status !== 'REDEEMED';

    const confirmationCode = firstTicket?.code || null;
    const redeemStart = formatDate(firstTicket?.redeemStart);
    const redeemEnd = formatDate(firstTicket?.redeemEnd);
    // Prefer the QAR amount saved locally at checkout — GlobalTix's own
    // booking-details API (`d.amount`) reports its settlement currency
    // (e.g. THB), not what the customer was actually charged in QAR.
    const amount = item.amount != null ? item.amount : null;
    const eTicketUrl = d?.eTicketUrl;
    const viewTicketUrl = d?.viewTicketUrl;

    const cardBg = isDark ? colors.navyBlue : colors.white;
    const textSecondary = isDark ? colors.lightGrey : colors.darkGrey;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpandedRef(isExpanded ? null : ref)}
        style={[styles.card, { backgroundColor: cardBg, borderColor: colors.mainBorder }]}
      >
        <View style={styles.cardHeader}>
          <TypographyText
            title={item.productName || 'GlobalTix Booking'}
            size={15}
            font={BALOO_SEMIBOLD}
            textColor={isDark ? colors.white : colors.black}
            style={{ flex: 1 }}
          />
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[status] || colors.darkGrey }]}>
            <TypographyText title={status} size={10} font={BALOO_SEMIBOLD} textColor={colors.white} />
          </View>
        </View>

        <TypographyText
          title={`Ref: ${ref}`}
          size={12}
          font={BALOO_SEMIBOLD}
          textColor={colors.mainDarkMode || '#DDBD6B'}
          style={{ marginTop: 4 }}
        />

        {item.ticketType ? (
          <TypographyText
            title={typeof item.ticketType === 'string' ? item.ticketType : item.ticketType?.name || ''}
            size={12}
            textColor={textSecondary}
            style={{ marginTop: 2 }}
          />
        ) : null}

        {item.visitDate ? (
          <TypographyText
            title={`Visit Date: ${item.visitDate}`}
            size={12}
            textColor={textSecondary}
            style={{ marginTop: 2 }}
          />
        ) : null}

        {item.fetchError && (
          <TypographyText
            title="Could not load live details"
            size={11}
            textColor={colors.red}
            style={{ marginTop: 4 }}
          />
        )}

        {/* Expand indicator */}
        <TypographyText
          title={isExpanded ? '▲ Hide details' : '▼ Show details'}
          size={11}
          textColor={colors.mainDarkMode || '#DDBD6B'}
          style={{ marginTop: 8 }}
        />

        {/* Expanded section */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            {amount != null && (
              <TypographyText
                title={`Amount Paid: QR ${Number(amount).toFixed(2)}`}
                size={12}
                textColor={textSecondary}
                style={{ marginTop: 6 }}
              />
            )}
            {confirmationCode && (
              <TypographyText
                title={`Confirmation Code: ${confirmationCode}`}
                size={12}
                textColor={textSecondary}
                style={{ marginTop: 6 }}
              />
            )}
            {redeemStart && redeemEnd && (
              <TypographyText
                title={`Valid: ${redeemStart} → ${redeemEnd}`}
                size={12}
                textColor={textSecondary}
                style={{ marginTop: 4 }}
              />
            )}

            {/* Ticket links */}
            <View style={styles.linkRow}>
              {eTicketUrl ? (
                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => Linking.openURL(eTicketUrl)}
                >
                  <TypographyText title="Download E-Ticket" size={12} font={BALOO_SEMIBOLD} textColor={colors.white} />
                </TouchableOpacity>
              ) : null}
              {viewTicketUrl ? (
                <TouchableOpacity
                  style={[styles.linkBtn, styles.linkBtnOutline]}
                  onPress={() => Linking.openURL(viewTicketUrl)}
                >
                  <TypographyText title="View Ticket" size={12} font={BALOO_SEMIBOLD} textColor={colors.mainDarkMode || '#DDBD6B'} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Cancel button */}
            {isCancellable && (
              <TouchableOpacity
                style={[styles.cancelBtn, isCancelling && styles.cancelBtnDisabled]}
                onPress={() => handleCancel(ref, item.productName)}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <TypographyText title="Cancel Booking" size={13} font={BALOO_SEMIBOLD} textColor={colors.white} />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <TypographyText title="🎫" size={48} />
      <TypographyText
        title="No bookings yet"
        size={16}
        font={BALOO_SEMIBOLD}
        textColor={isDark ? colors.lightGrey : colors.darkGrey}
        style={{ marginTop: 12 }}
      />
      <TypographyText
        title="Your GlobalTix bookings will appear here after checkout."
        size={13}
        textColor={isDark ? colors.lightGrey : colors.darkGrey}
        style={{ marginTop: 6, textAlign: 'center' }}
      />
    </View>
  );

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label="My Bookings"
          btns={['back', 'notifications']}
        />
      }
      headerHeight={50}
      contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 16 }}
    >
      {loadingRefs ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.mainDarkMode || '#DDBD6B'} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.referenceNumber}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          renderItem={renderBooking}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={bookings.length === 0 ? styles.emptyList : styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 12,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  expandedSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.mainBorder,
    paddingTop: 10,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  linkBtn: {
    backgroundColor: colors.mainDarkMode || '#DDBD6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  linkBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.mainDarkMode || '#DDBD6B',
  },
  cancelBtn: {
    marginTop: 12,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnDisabled: {
    opacity: 0.6,
  },
});

export default GlobalTixMyBookings;
