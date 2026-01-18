import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import {
  CartIcon,
  DecreaseQuantityIcon,
  IncreaseQuantityIcon,
  LocationIcon,
} from "../../../../../assets/delivery_assets";
import { SizedBox } from "./SizedBox";

function RestaurantListItem({ onSelectItem, title, onAddRemoveFromToCart }) {
  return (
    <View
      style={{
        padding: 8,
        margin: 16,
        backgroundColor: "#ffffff",
        borderRadius: 8,
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
      <TouchableOpacity onPress={onSelectItem}>
        <View style={{ flexDirection: "row", margin: 8 }}>
          <Image
            source={{
              uri: "https://cdn.sanity.io/images/czqk28jt/prod_bk/f4dc27eb7337f7cbd12d3ccd840e6a031fcba622-360x270.jpg",
            }}
            style={{ width: 64, height: 64, borderRadius: 16 }}
          />
          <SizedBox size={16} />

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#08003B",
              }}
            >
              {title}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                fontWeight: "200",
                color: "#999CAD",
              }}
            >
              {title} Burgers, Fast food, American sadkfjdsafndsjklfndskjfdsnkj
              sadjkfsdnfldsafnodis;al
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <SizedBox size={16} />
      <View
        style={{
          borderBottomColor: "grey",
          borderBottomWidth: 0.4,
        }}
      />
      <SizedBox size={8} />
      <View
        style={{
          flexDirection: "row",
          margin: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#999CAD",
              textDecorationLine: "line-through",
            }}
          >
            18.00 QR
          </Text>
          <SizedBox size={12} />

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#08003B",
            }}
          >
            16.00 QR
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => onAddRemoveFromToCart(0)}>
            <DecreaseQuantityIcon />
          </TouchableOpacity>
          <SizedBox size={12} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "200",
              color: "#08003B",
            }}
          >
            0
          </Text>
          <SizedBox size={12} />
          <TouchableOpacity onPress={() => onAddRemoveFromToCart(2)}>
            <IncreaseQuantityIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RestaurantListItem;
