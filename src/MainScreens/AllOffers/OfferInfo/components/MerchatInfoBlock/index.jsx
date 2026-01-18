import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import { useTheme } from "../../../../../components/ThemeProvider";
import { isRTL } from "../../../../../../utils";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { sized } from "../../../../../Svg";
import DiscountLabel from "../../../../../assets/discountLabel.svg";
import { useTranslation } from "react-i18next";

const MerchantInfoBlock = ({
  merchantName,
  merchantUrl,
  offerLabel,
  start_date,
  end_date,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const DiscountLabelF = sized(
    DiscountLabel,
    12,
    12,
    isDark ? colors.black : colors.darkBlue
  );

  const getFullDateString = () => {
    let fullDateStr = "";

    if (!!start_date) {
      fullDateStr = `${t("AllOffers.startDate")}  ${start_date}    `;
    }

    if (!!end_date) {
      fullDateStr = fullDateStr + `${t("AllOffers.endDate")}  ${end_date}`;
    }

    return fullDateStr;
  };

  const fullDateStr = getFullDateString();

  return (
    <>
      <View style={styles.wrapper}>
        <View>
          <Image
            source={{
              uri: merchantUrl,
            }}
            style={styles.logo}
          />
        </View>
        <TypographyText
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={18}
          title={merchantName}
          style={styles.merchantName}
          numberOfLines={1}
        />
        {!!offerLabel && (
          <View
            style={{
              backgroundColor: isDark ? colors.mainDarkMode : null,
              borderColor: isDark ? null : colors.darkBlue,
              ...styles.ribbonWrapper,
            }}
          >
            <DiscountLabelF />
            <TypographyText
              textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
              size={14}
              title={offerLabel}
              style={{
                marginLeft: 6,
                textAlign: "center",
              }}
              numberOfLines={1}
              textElipsis={"tail"}
            />
          </View>
        )}
      </View>

      {!!fullDateStr && (
        <View
          style={{
            flexDirection: isRTL() ? "row-reverse" : "row",
            marginTop: 20,
          }}
        >
          <TypographyText
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={18}
            title={fullDateStr}
            style={styles.date}
            numberOfLines={1}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  merchantName: {
    marginHorizontal: 8,
    flex: 1,
  },
  date: {
    marginRight: 5,
    textAlignVertical: "center",
    //flex: 1,
  },
  ribbonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});

export default MerchantInfoBlock;
