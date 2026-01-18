import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../../../components/ThemeProvider";
import { TypographyText } from "../../../../../../../components/Typography";
import { colors } from "../../../../../../../components/colors";
import { BALOO_SEMIBOLD } from "../../../../../../../redux/types";
import { Image } from "react-native";
import { handleBranchPress } from "../../../../../../MerchantsPage/helpers";

const BranchesInfoTab = ({ branches }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  if (!branches?.length) {
    const noDataText = t("AllOffers.noBranchesFound");

    return (
      <View style={styles.noData}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_SEMIBOLD}
          title={noDataText}
          style={styles.noDataText}
          numberOfLines={1}
        />
      </View>
    );
  }

  const handleBranchPressFunc = (branch) => {
    handleBranchPress(branch);
  };

  const textColor = isDark ? colors.mainDarkModeText : colors.darkBlue;
  const backgroundColor = isDark ? colors.mainDarkMode : "transparent";

  return (
    <View style={styles.wrapper}>
      {branches?.length &&
        branches.map((branch, i) => (
          <TouchableOpacity
            onPress={() => handleBranchPressFunc(branch)}
            style={[
              styles.row,
              styles.childWrapper,
              {
                borderColor: textColor,
                backgroundColor,
              },
            ]}
            key={i}
          >
            <View style={styles.childInfoWrapper}>
              <View style={styles.row}>
                <Image
                  source={{ uri: branch.merchant_logo }}
                  style={styles.logo}
                />
                <TypographyText
                  textColor={textColor}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={branch.merchant_name}
                  style={styles.name}
                  numberOfLines={2}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  childWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 20,
    marginRight: 10,
    width: "100%",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: "space-around",
  },
  name: {
    flex: 1,
    textAlign: "left",
    flexGrow: 1,
    marginLeft: 10,
  },
  row: {
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
  },
  loader: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  noData: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexGrow: 1,
    width: "100%",
    minHeight: 400,
  },
  noDataText: {
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default BranchesInfoTab;
