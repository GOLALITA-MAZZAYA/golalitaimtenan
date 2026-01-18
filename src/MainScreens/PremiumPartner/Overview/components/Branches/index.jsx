import { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import HeartSvg from "../../../../../assets/heart.svg";
import useGetData from "../../../../../hooks/useGetData";
import { useTheme } from "../../../../../components/ThemeProvider";
import useIsGuest from "../../../../../hooks/useIsGuest";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import { BALOO_SEMIBOLD, LUSAIL_REGULAR } from "../../../../../redux/types";
import { getTransformedBranches } from "../../../../MerchantsPage/helpers";

const IMAGE_SIZE = 66;

const Branches = (props) => {
  const { merchantId, onPress, onLikePress, getIsLiked } = props;

  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isGuest = useIsGuest();

  const { loading, data, error } = useGetData(async () =>
    getTransformedBranches(merchantId)
  );

  useEffect(() => {
    if (error) {
      console.log(" CardWithNesetedItems get branchs error");
    }
  }, [error]);

  const backgroundColor = isDark ? "#072536" : colors.white;
  const textColor = isDark ? colors.white : colors.darkBlue;

  const noData = (
    <View>
      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={14}
        font={BALOO_SEMIBOLD}
        title={t("ProductPage.noBranchesFound")}
        style={styles.noDataText}
        numberOfLines={1}
      />
    </View>
  );

  const renderItem = (item, i) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.row, styles.childWrapper]}
      key={i}
    >
      <View style={[styles.childInfoWrapper]}>
        <View style={styles.row}>
          <TypographyText
            textColor={textColor}
            size={16}
            font={BALOO_SEMIBOLD}
            title={item.name}
            style={styles.name}
            numberOfLines={2}
          />
          {!isGuest && (
            <TouchableOpacity onPress={() => onLikePress(item)}>
              <HeartSvg color={getIsLiked(item) ? "#E32251" : "#DDDFE4"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <TypographyText
        textColor={textColor}
        size={15}
        font={LUSAIL_REGULAR}
        style={{ fontWeight: "700" }}
        title={t("ProductPage.branches")}
      />
      <View>
        {loading && <FullScreenLoader style={styles.loader} />}

        {!loading && !data?.length && noData}

        {!loading && data?.map(renderItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  name: {
    flex: 1,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  childWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#DDDFE4",
    padding: 8,
    marginTop: 16,
    height: IMAGE_SIZE,
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: "space-around",
    marginLeft: 8,
  },
  loader: {
    marginTop: 16,
  },
  noDataText: {
    marginTop: 16,
    alignSelf: "center",
  },
});

export default Branches;
