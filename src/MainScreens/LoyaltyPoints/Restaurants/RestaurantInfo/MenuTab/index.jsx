import {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import WebView from "react-native-webview";
import ListNoData from "../../../../../components/ListNoData";
import {getRestaurantMenu} from "../../../../../api/restaurants";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";

const MenuTab = ({restaurantId}) => {
    const [menuPdfUrl, setMenuPdfUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const getMenu = async () => {
       try{
        setLoading(true);

        const res = await getRestaurantMenu(restaurantId);

        const menuPdfUrl = res?.[0]?.contract_file_url;

        if(menuPdfUrl){
            setMenuPdfUrl(menuPdfUrl)
        }

       }catch(err){

        console.log(err,'get menu error')

       }finally{
          setLoading(false);
       }
    }

    useEffect(() => {
      getMenu()
    },[restaurantId])

    return (
        <>
            {menuPdfUrl && <WebView
                startInLoadingState
                 source={{
                   uri: menuPdfUrl,
                 }}
                 style={styles.webView}
                 renderLoading={() => <FullScreenLoader absolutePosition />}
            />}
            {loading && <FullScreenLoader style={styles.loader} />}
            {!loading && !menuPdfUrl && <ListNoData style={styles.loader}/>}
        </>
    );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  }
});


export default MenuTab;