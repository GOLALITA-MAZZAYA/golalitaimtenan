import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  deleteMerchantFeedback,
  submitMerchantFeedback,
} from '../../../../../../api/merchants';
import { useTheme } from '../../../../../../components/ThemeProvider';
import { TypographyText } from '../../../../../../components/Typography';
import CommonButton from '../../../../../../components/CommonButton/CommonButton';
import ModalInfo from '../../../../../../components/ModalInfo/ModalInfo';
import { colors } from '../../../../../../components/colors';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../../../../../redux/types';
import { isRTL } from '../../../../../../../utils';
import { sized } from '../../../../../../Svg';
import CloseSvg from '../../../../../../assets/close.svg';
import StarFilledSvg from '../../../../../../assets/star-filled.svg';

const STAR_COLOR = '#FFB800';
const MAX_COMMENT_LENGTH = 500;

const RateModal = ({
  visible,
  onClose,
  onSubmitted,
  merchantId,
  merchantName,
  existingReview,
  onSaved,
  onDeleted,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // null | 'submitted' | 'updated' | 'deleted'
  const [successType, setSuccessType] = useState(null);
  const isEditing = !!existingReview;
  const isBusy = isSubmitting || isDeleting;

  // Pre-fill with the user's previous review each time the modal opens.
  useEffect(() => {
    if (visible) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || '');
      setError('');
    }
  }, [visible]);

  const textColor = isDark ? colors.white : colors.darkBlue;
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const emptyStarColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#E5E7EB';
  const sheetBg = isDark ? '#1C1C22' : colors.white;
  const CloseIcon = sized(CloseSvg, 22, 22, textColor);

  const reset = () => {
    setRating(0);
    setComment('');
    setError('');
    setSuccessType(null);
  };

  const handleClose = () => {
    if (isBusy) {
      return;
    }
    reset();
    onClose();
  };

  const handleSuccessClose = () => {
    reset();
    onClose();
    onSubmitted?.();
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      setError(t('Complaint.ratingRequired') || 'Please select a rating');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const trimmedComment = comment.trim();
      await submitMerchantFeedback({
        merchant_id: merchantId,
        rating,
        comment: trimmedComment,
      });
      await onSaved?.({ rating, comment: trimmedComment });
      setSuccessType(isEditing ? 'updated' : 'submitted');
    } catch (err) {
      setError(err?.message || t('MerchantFeedback.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async () => {
    setError('');
    setIsDeleting(true);

    try {
      await deleteMerchantFeedback(merchantId);
      await onDeleted?.();
      setSuccessType('deleted');
    } catch (err) {
      if (err?.notFound) {
        // Already gone on the server; drop the stale local copy.
        await onDeleted?.();
        setSuccessType('deleted');
      } else {
        setError(err?.message || t('MerchantFeedback.deleteError'));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('MerchantFeedback.deleteConfirmTitle'),
      t('MerchantFeedback.deleteConfirmMessage'),
      [
        { text: t('MerchantFeedback.cancel'), style: 'cancel' },
        {
          text: t('MerchantFeedback.delete'),
          style: 'destructive',
          onPress: deleteReview,
        },
      ],
    );
  };

  const getSentimentText = () => {
    if (!rating) return '';
    return t(`MerchantFeedback.rating${rating}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      {!!successType && (
        <ModalInfo
          isSuccess
          onCancel={handleSuccessClose}
          onSubmit={handleSuccessClose}
          title={
            successType === 'deleted'
              ? t('MerchantFeedback.deletedSuccess')
              : successType === 'updated'
                ? t('MerchantFeedback.updatedSuccess')
                : t('MerchantFeedback.submittedSuccess')
          }
          description={
            successType === 'deleted'
              ? t('MerchantFeedback.deletedDescription')
              : successType === 'updated'
                ? t('MerchantFeedback.updatedDescription')
                : t('MerchantFeedback.submittedDescription')
          }
        />
      )}

      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: sheetBg,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              borderWidth: isDark ? 1 : 0,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                flexDirection: isArabic ? 'row-reverse' : 'row',
                borderBottomColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <View>
              <TypographyText
                title={
                  isEditing
                    ? t('MerchantFeedback.editTitle')
                    : t('MerchantFeedback.title')
                }
                textColor={textColor}
                font={BALOO_SEMIBOLD}
                size={18}
                style={styles.title}
              />
              {!!merchantName && (
                <TypographyText
                  title={merchantName}
                  textColor={mutedColor}
                  font={BALOO_REGULAR}
                  size={13}
                  numberOfLines={1}
                  style={styles.merchantName}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={12}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Interactive Star Row */}
          <View style={styles.ratingSection}>
            <View
              style={[
                styles.starsRow,
                { flexDirection: isArabic ? 'row-reverse' : 'row' },
              ]}
            >
              {[1, 2, 3, 4, 5].map(star => {
                const isSelected = star <= rating;
                const StarIcon = sized(
                  StarFilledSvg,
                  36,
                  36,
                  isSelected ? STAR_COLOR : emptyStarColor,
                );
                return (
                  <TouchableOpacity
                    key={star}
                    activeOpacity={0.7}
                    onPress={() => {
                      setRating(star);
                      setError('');
                    }}
                    style={styles.starBtn}
                  >
                    <StarIcon />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dynamic Sentiment Badge */}
            {rating > 0 && (
              <View
                style={[
                  styles.sentimentBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 184, 0, 0.12)'
                      : 'rgba(255, 184, 0, 0.15)',
                  },
                ]}
              >
                <TypographyText
                  title={getSentimentText()}
                  textColor={STAR_COLOR}
                  font={BALOO_SEMIBOLD}
                  size={13}
                />
              </View>
            )}
          </View>

          {/* Comment Input */}
          <View style={styles.inputContainer}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={t('MerchantFeedback.commentPlaceholder')}
              placeholderTextColor={mutedColor}
              multiline
              maxLength={MAX_COMMENT_LENGTH}
              textAlignVertical="top"
              style={[
                styles.comment,
                {
                  color: textColor,
                  textAlign: isArabic ? 'right' : 'left',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.04)'
                    : '#F9FAFB',
                },
              ]}
            />
            <View
              style={[
                styles.counterRow,
                { flexDirection: isArabic ? 'row' : 'row-reverse' },
              ]}
            >
              <TypographyText
                title={`${comment.length}/${MAX_COMMENT_LENGTH}`}
                textColor={mutedColor}
                font={BALOO_REGULAR}
                size={11}
              />
            </View>
          </View>

          {/* Error Message */}
          {!!error && (
            <View style={styles.errorBox}>
              <TypographyText
                title={error}
                textColor="#FF406E"
                font={BALOO_REGULAR}
                size={13}
                style={styles.error}
              />
            </View>
          )}

          {/* Submit Button */}
          <CommonButton
            onPress={handleSubmit}
            label={
              isSubmitting
                ? t('Complaint.submitting') || 'Submitting...'
                : isEditing
                  ? t('MerchantFeedback.update')
                  : t('MerchantFeedback.submit')
            }
            disabled={isBusy}
            loading={isSubmitting}
            style={styles.submitBtn}
          />

          {/* Delete (only when the user has a review) */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isBusy}
              activeOpacity={0.7}
              style={styles.deleteBtn}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <TypographyText
                  title={t('MerchantFeedback.deleteMyReview')}
                  textColor="#EF4444"
                  font={BALOO_SEMIBOLD}
                  size={14}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheet: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: '700',
  },
  merchantName: {
    marginTop: 2,
    maxWidth: 240,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  starsRow: {
    justifyContent: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  sentimentBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 14,
  },
  comment: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
  },
  counterRow: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorBox: {
    marginBottom: 12,
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: 4,
  },
  deleteBtn: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
});

export default RateModal;
