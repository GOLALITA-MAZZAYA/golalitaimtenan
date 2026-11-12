import {useTranslation} from "react-i18next"
import FullScreenImageModal from "../FullScreenImageModal"
import {StyleSheet, View} from "react-native"
import {getInfoBlocksConfig, getOfferTypeInfoBtnsConfig} from "../../config"
import InfoWithTitleBlock from "../../../../../components/InfoWithTitleBlock"
import {handleMerchantCardPress} from "../../../../MerchantsPage/helpers"
import {navigateToBookNow} from "../../../helpres"
import {useState} from "react"
import OfferTypeInfoButtons from "../OfferTypeInfoButtons"
import Button from "../../../../../components/Button"
import useIsGuest from "../../../../../hooks/useIsGuest"

const InfoTab = ({offer, merchant, isHotel}) => {
    const {t} = useTranslation();
    const isGuest = useIsGuest();
    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    const data = getInfoBlocksConfig(offer, isHotel);

    const description = data.find(item => item.header);
    const restInfoBlocks = data.filter(item => !item.header)


    const handleMerchatDetails = () => {
      handleMerchantCardPress(merchant, offer);
    };

    const handleBookNowPress = () => {
      navigateToBookNow(offer, merchant)
    };

    const btnsConfig = getOfferTypeInfoBtnsConfig(offer);


    return (
        <>

        <View style={{marginTop: 20}}>
          {!!description && (
            <InfoWithTitleBlock
                 title={description.title}
                 description={description.description}
                 icon={description.icon}
                 onPress={description.onPress}
                 style={{ marginBottom: 10}}
            />
          )}

          <View style={styles.columnWrapper}>
            {restInfoBlocks.map((item, index) => (
              <InfoWithTitleBlock
                 key={item.title ?? index}
                 title={item.title}
                 description={item.description}
                 style={{width: '49%', marginBottom: 4}}
                 icon={item.icon}
                 onPress={item.onPress}
                 shortVersion={item.shortVersion}
                 shortVersionTitle={item.shortVersionTitle}
              />
            ))}
          </View>
        </View>

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={() => setSelectedImageUrl(null)}
            />

             <Button 
               text={t("ProductPage.merchantDetails")}
               onPress={handleMerchatDetails}
               style={styles.btn}
             />

              { isHotel === 'true' && <Button 
                text={t("Merchants.requestReservation")}
                onPress={handleBookNowPress}
                style={styles.btn}
              /> }
        

            {!isGuest && <OfferTypeInfoButtons data={btnsConfig} />}
        </>
    )
};

const styles = StyleSheet.create({
  columnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  btn: {
    marginTop: 20
  }
});


export default InfoTab;