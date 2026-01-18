import { StyleSheet, TouchableOpacity, View } from "react-native";
import BackSvg from "../../../../../assets/back.svg";
import { colors } from "../../../../../components/colors";
import { useNavigation } from "@react-navigation/native";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_BOLD } from "../../../../../redux/types";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../../redux/auth/auth-selectors";
import { Image } from "react-native";

const CheckoutHeader = ({ title, isDark }) => {
  const navigation = useNavigation();
  const userData = useSelector(userSelector);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  const color = isDark ? colors.white : colors.darkBlue;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleBackPress}>
        <BackSvg color={color} />
      </TouchableOpacity>

      <TypographyText
        title={title}
        textColor={color}
        size={18}
        font={BALOO_BOLD}
        style={styles.title}
        numberOfLines={1}
      />

      <TouchableOpacity onPress={navigateToProfile} style={styles.logo}>
        <Image
          source={{ uri: userData.photo }}
          style={styles.logo}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  logo: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  title: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 10,
    textAlign: "center",
  },
});

export default CheckoutHeader;
