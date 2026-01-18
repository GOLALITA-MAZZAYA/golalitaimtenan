import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { useTranslation } from "react-i18next";
import ExpandedCategoryBlocks from "../../../../components/ExpandedCategoryBlocks";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { B1G1, BALOO_SEMIBOLD } from "../../../../redux/types";
import { StyleSheet } from "react-native";
import { getNewOffers } from "../../../../api/offers";
import { ALL_OFFERS_ITEM, transformOffersData } from "./utils";
import { useNavigation } from "@react-navigation/native";
import { getOffsetAndLimit, getStringDate } from "../../../../../utils";
import { ALL_OFFERS_ID } from "./config";
import { colors } from "../../../../components/colors";

const { width } = Dimensions.get("screen");
const itemWidth = (width - 64) / 3;

const LIMIT = 15;

const FollowUs = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState(null);

  const pageRef = useRef(1);

  const [isShowLessVisible, setIsShowLessVisible] = useState(false);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewOffers({ ...getOffsetAndLimit(pageRef.current, LIMIT) })
      .then((newOffers) => setData(transformOffersData(newOffers)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (offerId, parentId, offer) => {
    if (offer.id === ALL_OFFERS_ID) {
      navigation.navigate("AllOffers");

      return;
    }

    if (offer.x_offer_type === B1G1) {
      navigation.navigate("Promocode", {
        merchant_name: offer.merchant_name,
        name: offer.name,
        expiryDate: offer.end_date
          ? getStringDate(offer.end_date.split(" ")[0])
          : null,
        merchant_logo: offer.merchant_logo,
        id: offer.id,
        promocode: offer.x_offer_type_promo_code,
        merchant_id: offer.merchant_id,
      });

      return;
    }

    navigation.navigate("ProductPage", {
      product: {
        ...offer,
        merchant_logo: offer.merchant_logo,
        merchant_id: offer.merchant_id,
        merchant_name: offer.merchant_name,
      },
    });
  };

  const handleShowMorePress = () => {
    if (pageRef.current === 1 && data?.length > 0) {
      pageRef.current = 2;
    }

    setLoading(true);

    getNewOffers({ ...getOffsetAndLimit(pageRef.current, LIMIT) })
      .then((res) => {
        if (!res?.length) {
          setIsShowMoreVisible(false);
          return;
        }

        if (!isShowLessVisible) {
          setIsShowLessVisible(true);
        }

        pageRef.current = pageRef.current + 1;
        setData((prevData) => {
          return prevData.concat(transformOffersData(res));
        });
      })
      .finally(() => setLoading(false));
  };

  const handleShowLessPress = () => {
    setIsShowLessVisible(false);
  };

  const renderNewBlock = (item) => {
    if (item.id === ALL_OFFERS_ID) {
      return null;
    }

    return (
      <View style={styles.newIcon}>
        <TypographyText
          textColor={isDark ? colors.white : "#000"}
          size={14}
          font={BALOO_SEMIBOLD}
          title={t("MainScreen.new")}
          style={styles.newText}
        />
      </View>
    );
  };

  const renderIcon = (item) => {
    if (item.id === ALL_OFFERS_ID) {
      return (
        <Image
          source={require("../../../../assets/allOffers.jpg")}
          style={styles.allOffersIcon}
        />
      );
    }
  };

  const transformedData = data ? [...data, ALL_OFFERS_ITEM] : null;

  return (
    <ExpandedCategoryBlocks
      data={transformedData}
      onPress={handlePress}
      title={t("MainScreen.followUs")}
      isDark={isDark}
      renderAdditionalItem={renderNewBlock}
      renderIcon={renderIcon}
      style={{ marginTop: 36 }}
      pagination={{
        onShowMorePress: handleShowMorePress,
        isShowMoreVisible: isShowMoreVisible && !loading,
        loading,
        isShowLessVisible: isShowLessVisible && !loading,
        onShowLessPress: handleShowLessPress,
      }}
      isShowMoreBtn={false}
    />
  );
};

const styles = StyleSheet.create({
  newIcon: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: "#E32251",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  newText: {
    color: "#fff",
  },
  allOffersIcon: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 8,
  },
});

export default FollowUs;
