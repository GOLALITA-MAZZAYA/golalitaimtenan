import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Linking, Dimensions, FlatList } from "react-native";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { setMarketingPopup } from "../../redux/global/global-actions";
import { setIsNotificationModal } from "../../redux/notifications/notifications-actions";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import CloseSvg from "../../assets/close.svg";
import { sized } from "../../Svg";
import { TypographyText } from "../Typography";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../redux/types";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";
import { openScreen as navigate } from "../../Navigation/RootNavigation";
import { handleRedirectScreen } from "../../utils/redirectScreen";
import trackActivity from "../../api/activityTracker";

const CloseIcon = sized(CloseSvg, 14);
const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.85;
// Banners are 9:16 portrait; cap the height so the card fits short screens.
const CARD_HEIGHT = Math.min((MODAL_WIDTH * 16) / 9, height * 0.7);

const MarketingPopupModal = ({
  marketingPopup,
  setMarketingPopup,
  getMerchantDetails,
  setIsNotificationModal,
  onClose,
  pageName = 'home',
  autoplay = true,
  autoplayTimeout = 2.5,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n?.dir?.() === 'rtl' || i18n?.language === 'ar';

  const flatListRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const [isImagesReady, setIsImagesReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const popups = useMemo(() => {
    if (!marketingPopup) return [];
    if (Array.isArray(marketingPopup)) {
      return marketingPopup.filter(Boolean);
    }
    return [marketingPopup];
  }, [marketingPopup]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!autoplay || popups.length <= 1 || !isVisible || !isImagesReady) {
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      if (isDraggingRef.current) return;

      const nextIndex = (currentIndexRef.current + 1) % popups.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * MODAL_WIDTH,
        animated: true,
      });
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, autoplayTimeout * 1000);
  }, [autoplay, popups.length, isVisible, isImagesReady, autoplayTimeout, stopAutoplay]);

  useEffect(() => {
    stopAutoplay();
    setIsImagesReady(false);
    setIsVisible(false);
    setCurrentIndex(0);
    currentIndexRef.current = 0;

    if (!popups.length) return;

    let cancelled = false;
    const imageUris = popups.map((p) => p.img).filter(Boolean);

    Promise.all(imageUris.map((uri) => Image.prefetch(uri).catch(() => null)))
      .then(() => {
        if (!cancelled) {
          setIsImagesReady(true);
          setIsVisible(true);
        }
      });

    return () => {
      cancelled = true;
      stopAutoplay();
    };
  }, [popups, stopAutoplay]);

  useEffect(() => {
    if (isVisible && isImagesReady && popups.length > 1 && autoplay) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => {
      stopAutoplay();
    };
  }, [isVisible, isImagesReady, popups.length, autoplay, startAutoplay, stopAutoplay]);

  if (!popups.length) return null;
  if (!isImagesReady) return null;

  // `popups` + `onClose` let a screen drive the modal with its own list
  // instead of the Home screen's redux one.
  const closePopups = () => (onClose ? onClose() : setMarketingPopup(null));

  const handleClose = () => {
    stopAutoplay();
    setIsVisible(false);
  };

  const handlePress = (item) => {
    setIsNotificationModal(null);

    trackActivity('marketing_popup_click', {
      reference: item.id,
      page_name: pageName,
      offer_id: item.offer_id || undefined,
      merchant_id: item.merchant?.id || undefined,
      metadata: item.action_url ? { action_url: item.action_url } : undefined,
    });

    handleClose();

    if (handleRedirectScreen(item, navigate)) {
      return;
    }

    if (item.offer_id) {
      navigate('AllOffers', {
        screen: 'offer-info',
        params: {
          productId: item.offer_id,
          title: item.name,
        },
      });
    } else if (item.merchant?.id) {
      getMerchantDetails(
        item.merchant.id,
        null,
        t,
        item.merchant.name,
      );
    } else if (item.action_url) {
      Linking.openURL(item.action_url);
    }
  };

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / MODAL_WIDTH);
    const nextIndex = Math.max(0, Math.min(index, popups.length - 1));
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
  };

  const renderSlide = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handlePress(item)}
      style={[
        styles.slide,
        !item.img && { backgroundColor: item.theme_color || colors.darkBlue },
      ]}
    >
      {item.img ? (
        <Image
          source={{ uri: item.img }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.textContainer}>
          <TypographyText
            title={item.name}
            size={24}
            font={BALOO_MEDIUM}
            textColor="#FFF"
            align="center"
          />
          {!!item.desc && (
            <TypographyText
              title={item.desc}
              size={16}
              font={BALOO_REGULAR}
              textColor="#FFF"
              align="center"
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onModalHide={closePopups}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={250}
      backdropOpacity={0.6}
      useNativeDriver
      style={styles.modal}
    >
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.content}>
            <FlatList
              ref={flatListRef}
              data={popups}
              keyExtractor={(item, index) => String(item.id ?? index)}
              renderItem={renderSlide}
              horizontal
              pagingEnabled
              bounces={false}
              scrollEnabled={popups.length > 1}
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={() => {
                isDraggingRef.current = true;
                stopAutoplay();
              }}
              onMomentumScrollEnd={(e) => {
                isDraggingRef.current = false;
                handleScrollEnd(e);
                if (autoplay && popups.length > 1) {
                  startAutoplay();
                }
              }}
              getItemLayout={(data, index) => ({
                length: MODAL_WIDTH,
                offset: MODAL_WIDTH * index,
                index,
              })}
            />
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, isRtl && styles.closeBtnRtl]}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CloseIcon color="#FFF" />
          </TouchableOpacity>
        </View>

        {popups.length > 1 && (
          <View style={styles.dots}>
            {popups.map((item, index) => (
              <View
                key={String(item.id ?? index)}
                style={[styles.dot, index === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: MODAL_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'visible',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  content: {
    width: MODAL_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  slide: {
    width: MODAL_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: MODAL_WIDTH,
    height: CARD_HEIGHT,
  },
  textContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#000',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 20,
  },
  closeBtnRtl: {
    right: undefined,
    left: -12,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFF',
  },
});

const mapStateToProps = (state, ownProps) => ({
  marketingPopup:
    ownProps.popups !== undefined
      ? ownProps.popups
      : state.globalReducer.marketingPopup,
});

export default connect(mapStateToProps, {
  setMarketingPopup,
  getMerchantDetails,
  setIsNotificationModal,
})(MarketingPopupModal);
