import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import CountryPickerComponent, {
  FlagButton,
  getAllCountries,
} from "react-native-country-picker-modal";
import { LUSAIL_REGULAR } from "../../../redux/types";
import { TypographyText } from "../../Typography";
import { sized } from "../../../Svg";
import CloseSvg from "../../../assets/close.svg";
import AllSvg from "../../../assets/all.svg";
import ArrowDownSvg from "../../../assets/arrow_down_thin.svg";
import { useTheme } from "../../ThemeProvider";
import { getTextAlign } from "../../../../utils";

const CountryPicker = (props) => {
  const { label, onChange, value, placeholder } = props;
  const [visible, setVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const { isDark } = useTheme();

  const CloseIcon = sized(CloseSvg, 14, 14, isDark ? "#838383" : "#072536");
  const ArrowIcon = sized(ArrowDownSvg, 22, 22, isDark ? "#838383" : "#072536");
  const AllIcon = sized(AllSvg, 22, 22, isDark ? "#838383" : "#072536");
  const RenderItemAllIcon = sized(
    AllSvg,
    22,
    22,
    isDark ? "#838383" : "#072536"
  );

  useEffect(() => {
    getAllCountries().then((countries) => {
      setCountries([
        {
          index: 500,
          item: {
            callingCode: ["500"],
            cca2: "All",
            currency: ["EUR"],
            flag: "dwadwa",
            name: "All",
            region: "Europe",
            subregion: "Western Europe",
          },
        },
        ...countries,
      ]);
    });
  }, []);

  const handleCoutryPress = (countryData) => {
    onChange(countryData);
    setVisible(false);
  };

  const filteredData = search
    ? countries.filter((country) => {
        return country?.name?.includes(search);
      })
    : countries;

  return (
    <TouchableOpacity style={styles.container} onPress={() => setVisible(true)}>
      {label && (
        <View style={styles.label}>
          <TypographyText
            textColor={isDark ? "#838383" : "#072536"}
            size={14}
            font={LUSAIL_REGULAR}
            title={label}
            numberOfLines={1}
            style={styles.labelText}
          />
        </View>
      )}
      <View style={styles.picker}>
        <View style={styles.country}>
          <CountryPickerComponent
            {...{
              countryCode: value?.cca2,
              withFilter: true,

              renderFlagButton: () => {
                if (!value?.cca2) {
                  return (
                    <View style={styles.allIconWrapper}>
                      <View style={styles.allIcon}>
                        <AllIcon />
                      </View>

                      {value && value?.item?.cca2 && (
                        <FlagButton placeholder="All" withCountryNameButton />
                      )}
                    </View>
                  );
                }

                return <FlagButton countryCode={value?.cca2} withFlagButton />;
              },
            }}
            onClose={() => setVisible(false)}
            visible={visible}
            placeholder={""}
            flatListProps={{
              contentContainerStyle: { paddingHorizontal: 16 },
              data: filteredData,
              renderItem: ({ item }) => {
                if (!item.cca2) {
                  return (
                    <TouchableOpacity
                      style={styles.allIconWrapper}
                      onPress={() => handleCoutryPress(item)}
                    >
                      <View style={styles.allIcon}>
                        <RenderItemAllIcon />
                      </View>

                      <FlagButton
                        placeholder={"All"}
                        withCountryNameButton
                        withFlagButton={false}
                        onOpen={() => handleCoutryPress(item)}
                      />
                    </TouchableOpacity>
                  );
                }

                return (
                  <View style={{ marginTop: 10 }}>
                    <FlagButton
                      key={item.cca2}
                      countryCode={item.cca2}
                      placeholder={item.placeholder}
                      withFlagButton
                      withCountryNameButton
                      onOpen={() => handleCoutryPress(item)}
                    />
                  </View>
                );
              },
            }}
            filterProps={{
              onChangeText: setSearch,
              value: search,
            }}
            modalProps={{
              style: styles.modal,
            }}
          />

          {value !== null && (
            <TypographyText
              textColor={isDark ? "#838383" : "#072536"}
              size={14}
              font={LUSAIL_REGULAR}
              title={value?.name}
              numberOfLines={1}
              style={{ ...getTextAlign() }}
            />
          )}
          {!value && (
            <TypographyText
              textColor={isDark ? "#838383" : "#072536"}
              size={14}
              font={LUSAIL_REGULAR}
              title={placeholder}
              numberOfLines={1}
              style={{
                ...getTextAlign(),
                flex: 1,
                paddingRight: 16,
              }}
            />
          )}
        </View>

        <View>
          {!value && (
            <View onPress={() => setVisible(true)} style={styles.iconWrap}>
              <ArrowIcon />
            </View>
          )}

          {value && (
            <TouchableOpacity
              onPress={() => onChange(null)}
              style={styles.iconWrap}
            >
              <CloseIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const darkTheme = StyleSheet.create({
  modalContainer: {
    backgroundColor: "red",
  },
  contentContainer: {
    backgroundColor: "red",
  },
  header: {
    backgroundColor: "red",
  },
  itemCountryName: {
    borderBottomWidth: 0,
  },
  countryName: {
    color: "red",
  },
  letterText: {
    color: "red",
  },
  input: {
    color: "red",
    borderBottomWidth: 1,
    borderColor: "red",
  },
});

const styles = StyleSheet.create({
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: "#999CAD",
    height: 52,
    paddingLeft: 10,
  },
  modal: {
    backgroundColor: "green",
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    width: "100%",
  },
  labelText: {
    marginLeft: 10,
  },
  label: {
    marginBottom: 11,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    height: 20,
    width: 20,
  },
  allIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,
  },
  allIcon: {
    borderRadius: 20,
    borderColor: "#000",
    borderWidth: 1,
    padding: 2,
    marginRight: 10,
  },
});

export default CountryPicker;
