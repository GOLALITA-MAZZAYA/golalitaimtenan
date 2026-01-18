import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { TypographyText } from "../../../../components/Typography";
import { useTheme } from "../../../../components/ThemeProvider";
import { getTransformedBranches, handleBranchPress } from "../../helpers";
import { colors } from "../../../../components/colors";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { isRTL } from "../../../../../utils";

  

const BranchItem = ({ merchantId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  
  const getBranches = async () => {
    try {
      setLoading(true);
      const data = await getTransformedBranches(merchantId);

      setData(data);
    } catch (err) {
      console.log(err, "get branches error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBranches(merchantId);
  }, []);

  if (loading) {
    return <FullScreenLoader style={styles.loader} />;
  }

  if (!loading && !data?.length) {
    const noDataText = t("AllOffers.noBranchesFound");

    return (
      <View style={styles.noData}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={12}
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
    <>
      {!loading &&
        data?.length &&
        data.map((branch, i) => (
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
                <TypographyText
                  textColor={textColor}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={isArabic ? branch.name_arabic : branch.name}
                  style={styles.name}
                  numberOfLines={2}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  childWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    marginRight: 10,
    width: 200,
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: "space-around",
    height: 40,
  },
  name: {
    flex: 1,
    textAlign: "left",
    flexGrow: 1,
  },
  row: {
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
  },
  loader: {
    marginTop: 16,
    alignSelf: "center",
  },
  noData: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexGrow: 1,
  },
});

export default BranchItem;
