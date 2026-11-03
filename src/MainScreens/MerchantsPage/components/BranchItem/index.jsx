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

  return (
    <View style={styles.container}>
      {!loading &&
        data?.length &&
        data.map((branch, i) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleBranchPressFunc(branch)}
            style={[
              styles.childWrapper,
              {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F5F5F7',
                flexDirection: isArabic ? 'row-reverse' : 'row',
              },
            ]}
            key={i}
          >
            <TypographyText
              textColor={isDark ? '#FFFFFF' : '#111827'}
              size={13}
              font={BALOO_SEMIBOLD}
              title={isArabic ? branch.name_arabic : branch.name}
              style={styles.name}
              numberOfLines={1}
            />
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  childWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  name: {
    fontWeight: '600',
  },
  loader: {
    marginTop: 12,
    alignSelf: "center",
  },
  noData: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    flexGrow: 1,
  },
  noDataText: {
    opacity: 0.7,
  },
});

export default BranchItem;
