import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { View, Image, Text, FlatList, TouchableOpacity } from "react-native";
//import {TouchableOpacity} from 'react-native-gesture-handler';

import { TimeIconDark } from "../../../../../assets/delivery_assets/index";
import {
  LocationIconSmall,
  StarDark,
  DeliveryItemIconDark,
} from "../../../../../assets/delivery_assets/index";
import { getBackGroundColor } from "../../../../../styles/colors";
import { useTheme } from "../../../../../components/ThemeProvider";
import {
  BALOO_MEDIUM,
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../../../../../redux/types";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import { SizedBox } from "../../_shared/componenets/SizedBox";

const ModeTest = () => {
  const isDarkMode = () => useTheme().isDark;
  return isDarkMode() ? true : false;
};
//const [dark, setdark] = useState(ModeTest());

const RestaurantItem = ({ restaurants, navigation }) => {
  useEffect(() => {}, []);

  const tst = ModeTest();
  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.merchant_id}
        onPress={() =>
          navigation.navigate("restaurantItems", {
            merchant_id: item.merchant_id,
          })
        }
      >
        <View
          style={{
            margin: 16,
            backgroundColor: "#ffffff",
            height: 260,
            borderRadius: 16,
            shadowOffset: {
              width: 4,
              height: 4,
            },
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 3,
            position: "relative",
          }}
        >
          <Image
            source={{
              uri: item.map_banner,
            }}
            style={{ flex: 1, alignSelf: "stretch", borderRadius: 16 }}
          />
          <View
            style={{
              backgroundColor: tst ? "#2F1539" : "#F3f3f3",
              flex: 1,
              alignSelf: "stretch",
              borderRadius: 16,
            }}
          >
            <View>
              <SizedBox size={24} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                }}
              >
                <View>
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={18}
                    font={BALOO_SEMIBOLD}
                    title={item.merchant_name}
                    style={{
                      lineHeight: 28.84,
                      fontWeight: "600",
                    }}
                  />
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={14}
                    font={BALOO_REGULAR}
                    title={item.merchant_name}
                    style={{
                      lineHeight: 22.43,
                      fontWeight: "400",
                      color: "#999CAD",
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={18}
                    font={BALOO_SEMIBOLD}
                    title="4.5"
                    style={{
                      lineHeight: 28.84,
                      fontWeight: "600",
                      color: "#FFB800",
                    }}
                  />
                  <StarDark style={{ top: 8, left: 4 }} />
                </View>
              </View>
              <SizedBox size={8} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <LocationIconSmall />
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={14}
                    font={BALOO_REGULAR}
                    title="15Km"
                    style={{
                      lineHeight: 22.43,
                      fontWeight: "400",
                      left: 5,
                      bottom: 3,
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TimeIconDark />
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={14}
                    font={BALOO_REGULAR}
                    title={item.delivery_cost}
                    style={{
                      lineHeight: 22.43,
                      fontWeight: "400",
                      left: 5,
                      bottom: 3,
                    }}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <DeliveryItemIconDark />
                  <TypographyText
                    textColor={tst ? colors.white : colors.darkBlue}
                    size={14}
                    font={BALOO_REGULAR}
                    title={item.delivery_cost}
                    style={{
                      lineHeight: 22.43,
                      fontWeight: "400",
                      left: 5,
                      bottom: 3,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: 55,
                height: 55,
                borderRadius: 55,
              }}
              source={{
                uri: item.merchant_logo,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={restaurants}
      renderItem={_renderItem}
      keyExtractor={(item) => item.merchant_id}
    />
  );
};

//export default RestaurantItem;

const mapStateToProps = (state) => ({
  restaurants: state.restaurantReducer.restaurants,
});
export default connect(mapStateToProps, {})(RestaurantItem);
