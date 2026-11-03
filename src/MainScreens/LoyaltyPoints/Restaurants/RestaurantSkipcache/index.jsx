import WebView from "react-native-webview";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";

const RestaurantSkipcache = ({route}) => {
    const {payment_url, title} = route.params;

    console.log(payment_url,'url')

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={title} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: 'auto', flex: 1, paddingBottom: 180  }}
      >
        <WebView
          source={{
            uri: payment_url,
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

export default RestaurantSkipcache;

