import React, {useEffect, useRef} from 'react';
import {View} from "react-native";
import {mainStyles, SCREEN_WIDTH} from "../../../styles/mainStyles";
import {colors} from "../../../components/colors";
import DashboardCircle from "./DashboardCircle";
import Swiper from 'react-native-swiper'
import sized from "../../../Svg/sized";
import ProductSvg from "../../../assets/products_orange.svg";
import RestaurantsSvg from "../../../assets/restaurants_board.svg";
import OthersSvg from '../../../assets/others_board.svg'
import SportSvg from '../../../assets/sport_board.svg'
import PhoneSvg from '../../../assets/phone_board.svg'
import HealthSvg from '../../../assets/health_board.svg'
import TravelSvg from '../../../assets/travel_board.svg'
import TaxiSvg from '../../../assets/taxi_board.svg'
import CommunalSvg from '../../../assets/communal_board.svg'
import AutoSvg from '../../../assets/auto_board.svg'
import RepairSvg from '../../../assets/repair_board.svg'
import ClothesSvg from '../../../assets/clothes_board.svg'
import HouseSvg from '../../../assets/house_board.svg'
import MovieSvg from '../../../assets/movie_board.svg'
import AnimalsSvg from '../../../assets/animals_board.svg'
import BooksSvg from '../../../assets/books_board.svg'
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import CommonButton from "../../../components/CommonButton/CommonButton";
import {useNavigation} from "@react-navigation/native";
import {useTheme} from "../../../components/ThemeProvider";

const ProductsIcon = sized(ProductSvg, 50)
const RestaurantsIcon = sized(RestaurantsSvg, 50)
const OthersIcon = sized(OthersSvg, 50)
const SportIcon = sized(SportSvg, 50)
const PhoneIcon = sized(PhoneSvg, 50)
const HealthIcon = sized(HealthSvg, 50)
const TravelIcon = sized(TravelSvg, 50)
const TaxiIcon = sized(TaxiSvg, 50)
const CommunalIcon = sized(CommunalSvg, 50)
const AutoIcon = sized(AutoSvg, 50)
const RepairIcon = sized(RepairSvg, 50)
const ClothesIcon = sized(ClothesSvg, 50)
const HouseIcon = sized(HouseSvg, 50)
const MovieIcon = sized(MovieSvg, 50)
const AnimalsIcon = sized(AnimalsSvg, 50)
const BooksIcon = sized(BooksSvg, 50)

const DashboardGraph = ({swipeElement, categories}) => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {isDark} = useTheme()
  let percentArray = [10, 3, 7, 5, 6, 3, 2, 4, 10, 7, 8, 5, 4, 10, 7, 3, 4, 2]

  return (
    <View style={{flex: 1, marginTop: -30}}>
      <Swiper loop={false} style={{maxHeight: 550}} dot={<View style={[mainStyles.dot, {backgroundColor: colors.lightGrey}]} />}
              activeDot={<View style={[mainStyles.dot, {backgroundColor: colors.green}]} />}>
        {categories.map((c, i) => ({...c, percent: percentArray[i]})).map((percent, index) => {
          return <DashboardCircle key={index} currentIndex={index} percents={categories.map((c, i) => ({...c, percent: percentArray[i]}))} item={percent} />
        })}
      </Swiper>
      <View style={mainStyles.p20}>
        <CommonButton label={t('TabBar.onlineStore', {name: ''})}
                      onPress={() => navigation.navigate('OnlineStores')}
                      style={{
                        ...mainStyles.borderButton,
                        ...mainStyles.mb20, borderColor: colors.green,
                        backgroundColor: isDark ? colors.darkBlue : colors.white
                      }}
                      textColor={colors.green}/>
      </View>
      <View style={{marginBottom: 150}} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  categories: state.merchantReducer.categories
})

export default connect(mapStateToProps, {})(DashboardGraph)
