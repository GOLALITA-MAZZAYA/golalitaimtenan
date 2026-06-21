import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Linking, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { setMarketingPopup } from "../../redux/global/global-actions";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import CloseSvg from "../../assets/close.svg";
import { sized } from "../../Svg";
import { TypographyText } from "../Typography";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../redux/types";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";
import { navigate } from "../../Navigation/RootNavigation";

const CloseIcon = sized(CloseSvg, 14);
const { width, height } = Dimensions.get('window');

const MarketingPopupModal = ({
  marketingPopup,
  setMarketingPopup,
  getMerchantDetails,
}) => {
  const { t } = useTranslation();
  console.log(marketingPopup, 'marketingPopup')
  if (!marketingPopup) return null;

  const handleClose = () => {
    setMarketingPopup(null);
  };

  const handlePress = () => {
    if (marketingPopup.offer_id) {
      // Same pattern as helpers.js handleOfferCardPress (from outside AllOffers navigator)
      navigate('AllOffers', {
        screen: 'offer-info',
        params: {
          productId: marketingPopup.offer_id,
          title: marketingPopup.name,
        },
      });
    } else if (marketingPopup.merchant?.id) {
      // getMerchantDetails internally calls navigate() to merchant-info screen
      getMerchantDetails(
        marketingPopup.merchant.id,
        null,
        t,
        marketingPopup.merchant.name,
      );
    } else if (marketingPopup.action_url) {
      Linking.openURL(marketingPopup.action_url);
    }
    handleClose();
  };

  const themeColor = marketingPopup.theme_color || colors.mainColor;

  return (
    <Modal
      isVisible={!!marketingPopup}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.6}
      useNativeDriver
      style={styles.modal}
    >
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={[styles.content, !marketingPopup.img && { backgroundColor: themeColor }]}>
          {marketingPopup.img ? (
            <Image
              source={{ uri: marketingPopup.img }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.textContainer}>
              <TypographyText
                title={marketingPopup.name}
                size={24}
                font={BALOO_MEDIUM}
                textColor="#FFF"
                align="center"
              />
              <TypographyText
                title={marketingPopup.desc}
                size={16}
                font={BALOO_REGULAR}
                textColor="#FFF"
                align="center"
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <CloseIcon color="#FFF" />
        </TouchableOpacity>
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
  container: {
    width: width * 0.85,
    minHeight: 250,
    maxHeight: height * 0.7,
    borderRadius: 16,
    overflow: 'visible',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  content: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    minHeight: height * 0.5,
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
    zIndex: 10,
  }
});

const mapStateToProps = (state) => ({
  marketingPopup: state.globalReducer.marketingPopup,
});

export default connect(mapStateToProps, {
  setMarketingPopup,
  getMerchantDetails
})(MarketingPopupModal);
