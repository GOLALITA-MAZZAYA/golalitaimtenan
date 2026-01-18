import WebView from "react-native-webview";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";

const LoyaltyVoucherSkipcache = ({route}) => {
    const {url, title} = route.params;

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={title} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: 'auto', flex: 1, paddingBottom: 180  }}
      >
        <WebView
          source={{
            uri: url,
          }}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          javaScriptEnabled={true}
          mixedContentMode={"always"}
          style={{ flex: 1 }}
        //   onNavigationStateChange={handleNavigationChange}
        />
        </MainLayout>
    )

};

export default LoyaltyVoucherSkipcache;

