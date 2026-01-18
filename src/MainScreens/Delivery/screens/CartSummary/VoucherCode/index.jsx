import { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getDiscountFromVouchercode } from "../../../../../api/delivery";
import CheckedSvg from "../../../../../assets/delivery_assets/checked.svg";
import CardSvg from "../../../../../assets/delivery_assets/card.svg";
import { colors } from "../../../../../components/colors";
import { BALOO_SEMIBOLD } from "../../../../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../../../../redux/auth/auth-selectors";
import { setVoucherDiscount as setVoucherDiscountAction } from "../../../../../redux/cart/cart-actions";
import { useTranslation } from "react-i18next";

const VoucherCode = ({ isDark }) => {
  const [voucherCode, setVouchercode] = useState("");
  const [wrongVoucherErr, setWrongVoucherErr] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(userSelector);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const checkPromocode = async () => {
    try {
      setLoading(true);

      const data = await getDiscountFromVouchercode({
        customer_id: user.partner_id,
        voucher_code: voucherCode,
      });

      if (data?.error) {
        setWrongVoucherErr(true);
        setVouchercode("");
        return;
      }

      const discount = data?.[0]?.voucher_value;

      inputRef.current.blur();

      setVoucherDiscount(discount);

      dispatch(
        setVoucherDiscountAction({
          discount,
          value: voucherCode,
        })
      );
    } catch (err) {
      console.log(err, "err");
      setWrongVoucherErr(true);
      setVouchercode("");
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherCodeChange = (text) => {
    if (wrongVoucherErr) {
      setWrongVoucherErr(false);
    }
    setVouchercode(text);
  };

  return (
    <View style={styles.wrapper}>
      <Text
        style={[styles.title, { color: isDark ? colors.white : colors.grey }]}
      >
        {t("CartSummary.specialInstructions")}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: voucherDiscount
              ? "green"
              : isDark
              ? colors.secBlue
              : colors.white,
          },
          { backgroundColor: isDark ? colors.secBlue : colors.white },
        ]}
      >
        <CardSvg color={isDark ? colors.white : colors.grey} />
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: isDark ? colors.white : colors.darkBlue },
          ]}
          value={voucherCode}
          onChangeText={handleVoucherCodeChange}
          placeholder={t("CartSummary.enterVoucherCode")}
          editable={!voucherDiscount}
          placeholderTextColor={isDark ? colors.white : colors.darkBlue}
        />

        {voucherCode && !wrongVoucherErr && !loading && !voucherDiscount && (
          <TouchableOpacity onPress={checkPromocode}>
            <CheckedSvg />
          </TouchableOpacity>
        )}

        {loading && <ActivityIndicator />}
      </View>

      {wrongVoucherErr && (
        <Text style={styles.wrongVoucherCode}>
          {t("CartSummary.invalidVoucher")}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontFamily: BALOO_SEMIBOLD,
    fontSize: 14,
    color: colors.grey,
  },
  wrongVoucherCode: {
    fontFamily: BALOO_SEMIBOLD,
    fontSize: 14,
    color: "red",
    marginTop: 6,
  },
});

export default VoucherCode;
