import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { TypographyText } from "../../Typography";
import { BALOO_2 } from "../../../redux/types";
import { colors } from "../../colors";
import CustomInput from "../CustomInput";
import { getAllCountries } from "react-native-country-picker-modal";


const getFlagEmoji = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );

const CustomPhoneInput = ({
  disabled,
  label,
  onChange,
  value,
  defaultCountry = "QA",
  defaultCallingCode = "974",
  placeholder,
  style,
}) => {
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [callingCode, setCallingCode] = useState(defaultCallingCode);
  const [phone, setPhone] = useState("");
  const [visible, setVisible] = useState(false);

  const backgroundStyles = {
    backgroundColor: colors.loyaltyCardBackground,
    borderColor: colors.loyaltyMainBorder,
  };

  const devideCountryCodeFromFullNumber = async () => {
     if (!value) {
    setPhone("");
    return;
  }

  const cleanValue = value.replace("+", "");

  const countries = await getAllCountries();

  const matchedCountry = countries.find(country => cleanValue.startsWith(country.callingCode[0]));

  if (matchedCountry) {
    const detectedCallingCode = matchedCountry.callingCode[0];

  

    setCountryCode(matchedCountry.cca2);
    setCallingCode(detectedCallingCode);
    setPhone(cleanValue.slice(detectedCallingCode.length));
  } else {
    // fallback
    setPhone(cleanValue);
  }
  }


  useEffect(() => {
    devideCountryCodeFromFullNumber();
}, [value]);


  useEffect(() => {
    if (onChange) {
      onChange(`${callingCode}${phone}`);
    }
  }, [callingCode, phone]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <TypographyText
          title={label}
          font={BALOO_2}
          style={styles.label}
          textColor={colors.loyaltyTextSecondary}
        />
      )}

      <View style={styles.row}>
        <TouchableOpacity
          disabled={disabled}
          style={[styles.codeBox, backgroundStyles]}
          onPress={() => {
            if(disabled){
                return
            }
            
            setVisible(true)
        }}
        >
          {!disabled && <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode={false}
            withFilter
            withModal={!disabled}
            visible={visible}
            onClose={() => setVisible(false)}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />}

          {disabled && <TypographyText
             title={getFlagEmoji(countryCode)}
             size={26}
          />}

          <TypographyText
            title={`+${callingCode}`}
            font={BALOO_2}
            size={16}
            style={styles.codeText}
            textColor={
              disabled
                ? colors.loyaltyTextSecondary
                : colors.loyaltyTextMain
            }
          />
        </TouchableOpacity>

        <CustomInput
          value={phone}
          onChangeText={setPhone}
          placeholder={placeholder}
          inputStyle={{ ...styles.numberInput }}
          disabled={disabled}
          rtlDisabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    marginHorizontal: 9
  },
  row: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    height: 57
  },
  codeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  numberBox: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    justifyContent: "center",
    height: 57,
    padding: 16,
  },
  numberInput: {
    fontSize: 16,
  },
});

export default CustomPhoneInput
