import {ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import {useTheme} from "../../../../components/ThemeProvider";
import MP4Slider from "../../../../components/MP4Slider";

const BANNERS = [require('../../../../assets/loyaltyPoints/categories/categories.mp4')]

const CardsList = ({data=[], loading=false, noDataText='No data', onPress, hasBanners = false}) => {

    const {isDark} = useTheme();

    const textColor = isDark ? colors.mainDarkMode: colors.darkBlue
    return (
       <FlatList 
         data={loading ? []: data}
         style={styles.list}
         contentContainerStyle={styles.contentContainerStyle}
         ListHeaderComponent={
            hasBanners && <MP4Slider
         data={BANNERS}
         style={styles.banners}
           />
         }
         renderItem={({item, index}) => (
           <TouchableOpacity onPress={onPress ? onPress(item):() => item.onPress(item)} style={[styles.item,{marginTop: !index ? 0: 15}]}>
              <Image source={item.source} style={styles.image} resizeMode="cover"/>
           </TouchableOpacity>
         )}
         ListEmptyComponent={(
             loading ? <ActivityIndicator /> :   <TypographyText
                         title={noDataText}
                         textColor={textColor}
                         size={16}                
                     />
         )}
       
       />
    )
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20
  },
  contentContainerStyle: {
   flexGrow: 1,
   paddingBottom: 180
  },
  item: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    height: 180,
    width: '100%'
  },
  banners: {
    marginBottom: 20
  }
});

export default CardsList;