import { FlatList, Linking, StyleSheet } from 'react-native';
import { View } from 'react-native';
import InfoWithTitleBlock from '../../../../../components/InfoWithTitleBlock';
import MapViewBtn from '../../../../PremiumPartner/MerchantInfo/InfoTab/MapViewBtn';
import {getSmallDescriptionBlocks} from './config';
import {isRTL} from '../../../../../../utils';
import {useTranslation} from 'react-i18next';

const InfoTab = ({ restaurantData }) => {
  const {t} = useTranslation();
  const isRtl = isRTL();
  const smallInfoBlocksData = getSmallDescriptionBlocks(restaurantData);
  const blocksDataWithoutAddress = smallInfoBlocksData.filter(item => !item.footer);
  const footerItem = smallInfoBlocksData.find(item => item.footer);
  const googleMapLink = restaurantData?.contact?.google_map_link;

  const handleMapPress = () => {
    Linking.openURL(restaurantData.contact.google_map_link)
  }

  return (
    <View style={styles.wrapper}>

      <InfoWithTitleBlock
          title={t('Restaurants.descriptionLabel')}
          description={isRtl ? restaurantData?.about?.description_ar: restaurantData?.about?.description}
          style={{width: '100%'}}
        //   icon={item.icon}
       />

      <View style={styles.smallDescriptionBlocks} >

        <FlatList 
          data={blocksDataWithoutAddress}
          numColumns={2}
          renderItem={({item}) => (
              <InfoWithTitleBlock
                 title={item.title}
                 description={item.description}
                 style={{width: '49%'}}
                 icon={item.icon}
                 onPress={item.onPress}
                 shortVersion={item.shortVersion}
                 shortVersionTitle={item.shortVersionTitle}
              />
          )}
          columnWrapperStyle={styles.columnWrapper}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={(
              <InfoWithTitleBlock
                 title={footerItem.title}
                 description={footerItem.description}
                 style={{width: '100%', marginTop: 10}}
                 icon={footerItem.icon}
                 onPress={footerItem.onPress}
                 shortVersion={footerItem.shortVersion}
                 shortVersionTitle={footerItem.shortVersionTitle}
              />
          )}
        />

      </View>

      {googleMapLink && <MapViewBtn
        style={styles.mapBlock}
        onPress={handleMapPress}
      />}

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexGrow: 1,
    marginTop: 20
  },
  controllBtns: {
    flexDirection: 'row',
  },
  infoItem: {
    marginTop: 40,
  },
  infoItemTitleWrapper: {
    width: '100%',
  },
  infoItemTitle: {
    borderRadius: 10,
  },
  infoItemValue: {
    marginTop: 3,
  },
  smallDescriptionBlocks: {
    marginTop: 20
  },
  mapBlock: {
    marginTop: 16
  },
  columnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 4,     
  }
});

export default InfoTab;
