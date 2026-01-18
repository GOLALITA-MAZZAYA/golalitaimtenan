import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_BOLD } from "../../../../redux/types";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import { getGiftCardAmount } from "../../../../api/giftCard";
import Range from "./Range";
import { useTranslation } from "react-i18next";
import Select from "../../../../components/Form/Select";

const getOptions = (denominations) => {
  return denominations.map((item) => ({
    value: item.amount,
    label: `${item.amount} ${item.currency}`,
  }));
};

const Amount = ({
  onSlidingComplete,
  giftCardId,
  onIncrement,
  onDecrement,
}) => {
  const [giftCardAmounts, setGiftCardAmounts] = useState(null);
  const { isDark } = useTheme();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowerLimit, setLowerLimit] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getGiftCardAmount(giftCardId)
      .then((amounts) => {
        setGiftCardAmounts(amounts);

        const defaultAmount =
          amounts?.length > 1 ? amounts[0].amount : amounts[0]?.min_amount;

        onSlidingComplete(defaultAmount);

        setAmount(defaultAmount);
        setLowerLimit(defaultAmount);
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoading(false));
  }, []);

  const incrementValue = (value) => {
    onIncrement(value, giftCardAmounts[0]?.max_amount);
    if (amount < giftCardAmounts[0]?.max_amount) {
      setAmount(value); // Adjust increment step as needed
    }
  };
  const decrementValue = (sliderValue) => {
    if (amount > lowerLimit) {
      onDecrement(sliderValue, lowerLimit);
      setAmount(sliderValue); // Adjust decrement step as needed
    }
  };

  return (
    <View>
      <TypographyText
        title={t("Vouchers.giftCardAmount")}
        textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
        size={18}
        font={BALOO_BOLD}
        style={styles.priceTitle}
      />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

      {!loading &&
        giftCardAmounts?.length === 1 &&
        !!giftCardAmounts[0]?.min_amount && (
          <View>
            <Range
              minAmount={giftCardAmounts[0]?.min_amount}
              maxAmount={giftCardAmounts[0]?.max_amount}
              onValueChange={setAmount}
              value={amount}
              onSlidingComplete={onSlidingComplete}
              maximumTrackTintColor={
                isDark ? colors.mainDarkMode : colors.darkBlue
              }
              thumbTintColor={isDark ? colors.white : colors.darkBlue}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                //backgroundColor: "red",
                paddingTop: 21,
              }}
            >
              <TouchableOpacity
                style={styles.incridecriButton}
                onPress={() => decrementValue(amount - 1)}
              >
                <TypographyText
                  title={`-`}
                  textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                  size={22}
                  font={BALOO_BOLD}
                  style={{}}
                />
              </TouchableOpacity>
              <TypographyText
                title={`${giftCardAmounts[0].currency} ${amount}`}
                textColor={
                  isDark ? colors.mainDarkMode : colors.mainDarkModeText
                }
                size={18}
                font={BALOO_BOLD}
                style={styles.price}
              />
              <TouchableOpacity
                style={styles.incridecriButton}
                onPress={() => {
                  incrementValue(amount + 1);
                }}
              >
                <TypographyText
                  title={`+`}
                  textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                  size={22}
                  font={BALOO_BOLD}
                  style={{}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

      {!loading &&
        !!giftCardAmounts?.length &&
        !!giftCardAmounts?.[0]?.amount && (
          <Select
            mainStyle={styles.select}
            placeholder={t("Vouchers.amountSelectPlaceholder")}
            options={getOptions(giftCardAmounts)}
            value={amount}
            onChange={(val) => {
              if (val) {
                onSlidingComplete(val);
              }
              setAmount(val);
            }}
            single={true}
            allowClear={false}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  priceTitle: {
    marginTop: 24,
    marginBottom: 11,
  },
  price: {
    textAlign: "center",
    marginTop: 11,
  },
  select: {
    marginTop: 10,
  },
  incridecriButton: {
    // backgroundColor:'green',
    paddingHorizontal: 19,
  },
});

export default Amount;
