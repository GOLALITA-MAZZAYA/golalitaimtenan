import { Image } from 'react-native';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '../../../../components/colors';
import {
  getInfoText,
  getOffersForNestedItemsCard,
  handleInfoTextPress,
  navigateTopProductPage,
} from '../../../AllOffers/helpres';
import { useDispatch, useSelector } from 'react-redux';
import { TypographyText } from '../../../../components/Typography';
import { BALOO_SEMIBOLD } from '../../../../redux/types';
import { useEffect, useState } from 'react';
import { useTheme } from '../../../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { saveOffer } from '../../../../redux/merchant/merchant-thunks';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import HeartSvg from '../../../../assets/heart.svg';
import { sized } from '../../../../Svg';
import ArrowSvg from '../../../../assets/arrow_right.svg';

const IMAGE_SIZE = 66;

const OfferItem = ({ merchant, isB1G1 }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const dispatch = useDispatch();

  const ArrowIconBig = sized(ArrowSvg, 22, 22, '#E32251');

  const favoriteOffers = useSelector(
    state => state.merchantReducer.favoriteOffers,
  );

  const getOffers = async () => {
    try {
      setLoading(true);
      // merchant.merchant_id = merchant.id;
      const data = await getOffersForNestedItemsCard(merchant, isB1G1 && 'all');

      setData(data);
    } catch (err) {
      console.log(err.message, 'get offers error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers(merchant);
  }, []);

  if (loading) {
    return <FullScreenLoader style={styles.loader} />;
  }

  if (!loading && !data?.length) {
    const noDataText = t('AllOffers.noOffersFound');

    return (
      <View style={styles.noData}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={12}
          font={BALOO_SEMIBOLD}
          title={noDataText}
          style={styles.noDataText}
          numberOfLines={1}
        />
      </View>
    );
  }

  if (!loading && data?.length) {
    return data.map((item, i) => {
      const isLiked =
        favoriteOffers?.find?.(o => o?.id === item?.id) !== undefined;

      const infoText = getInfoText(item, merchant);
      const price = item.value
        ? `QAR ${item.value}`
        : item.x_offer_type_discount > 0
          ? `${t('Merchants.discount')} ${item.x_offer_type_discount}%`
          : '';

      const textColor = isDark ? colors.mainDarkModeText : colors.darkBlue;
      const backgroundColor = isDark ? colors.mainDarkMode : 'transparent';

      return (
        <TouchableOpacity
          onPress={() => navigateTopProductPage(item, merchant)}
          style={[
            styles.row,
            styles.childWrapper,
            { borderColor: textColor, backgroundColor },
          ]}
          key={i}
        >
          <Image source={{ uri: item.uri }} style={styles.image} />

          <View style={styles.childInfoWrapper}>
            <View style={styles.row}>
              <TypographyText
                textColor={textColor}
                size={14}
                font={BALOO_SEMIBOLD}
                title={language === 'ar' ? item.x_arabic_name : item.name}
                style={styles.name}
                numberOfLines={2}
              />

              <TouchableOpacity
                onPress={() => dispatch(saveOffer(item.id, t))}
                style={{ paddingLeft: 5 }}
              >
                <HeartSvg color={isLiked ? '#E32251' : '#DDDFE4'} />
              </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
              {!!price && (
                <TypographyText
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={price}
                  style={styles.valueText}
                />
              )}

              {infoText && (
                <TouchableOpacity
                  style={styles.infoLink}
                  onPress={() => handleInfoTextPress(item, merchant)}
                >
                  <TypographyText
                    textColor={
                      isDark ? colors.mainDarkModeText : colors.darkBlue
                    }
                    size={14}
                    font={BALOO_SEMIBOLD}
                    title={infoText}
                    style={styles.valueText}
                  />

                  <ArrowIconBig />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 16,
    marginBottom: 16,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  name: {
    flex: 1,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    color: '#E32251',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-around',
    height: IMAGE_SIZE,
  },
  childWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 16,
    marginRight: 10,
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    height: IMAGE_SIZE,
    marginLeft: 8,
  },
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    marginTop: 16,
  },
  noDataText: {
    alignSelf: 'center',
  },
  logo: {
    backgroundColor: '#fff',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
    padding: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 16,
    alignSelf: 'center',
  },
  noData: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexGrow: 1,
  },
});

export default OfferItem;
