import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { colors } from "../../components/colors";
import { useTheme } from "../../components/ThemeProvider";
import WebView from "react-native-webview";

const Website = (props) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  let params = props.route?.params;

  const handleBackPress = () => {
    navigation.goBack ? navigation.goBack() : navigation.navigate("Main");
  };

  const handleNavigationChange = (navState) => {
    const { url } = navState;

    if (url && url.includes("globaltixpaystatus.com")) {
      // Navigate directly to GlobalTixCartScreen to ensure we end up on the right screen
      setTimeout(() => {
        navigation.navigate("GlobalTixCartScreen");
      }, 100);
    }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    console.log('[Website] onShouldStartLoadWithRequest url:', url);
    if (url && url.startsWith("golalitaimtenanrewards://")) {
      console.log('[Website] deep link detected — going back');
      navigation.goBack();
      return false;
    }
    return true;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CommonHeader
          isWhite={isDark}
          label={params.title}
          onBackPress={handleBackPress}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <WebView
          source={{
            uri: params.url,
          }}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          javaScriptEnabled={true}
          mixedContentMode={"always"}
          originWhitelist={["*"]}
          style={{ flex: 1 }}
          onNavigationStateChange={handleNavigationChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        />
      </SafeAreaView>
    </View>
  );
};

export default Website;
