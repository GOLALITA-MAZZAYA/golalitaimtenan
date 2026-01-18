import React, {useState} from 'react';
import {sized} from "../../../Svg";
import ProductsSvg from "../../../assets/categ_products.svg";
import RestaurantsSvg from "../../../assets/categ_rests.svg";
import OthersSvg from "../../../assets/categ_others.svg";
import SportSvg from "../../../assets/categ_sport.svg";
import MobileSvg from "../../../assets/categ_mobile.svg";
import HealthSvg from "../../../assets/categ_health.svg";
import TravelSvg from '../../../assets/travel.svg'
import TaxiSvg from '../../../assets/taxi.svg'
import CommunalSvg from '../../../assets/communal.svg'
import AutoSvg from '../../../assets/auto.svg'
import RepairSvg from '../../../assets/repair.svg'
import ClothingSvg from '../../../assets/clothing.svg'
import HouseSvg from '../../../assets/house.svg'
import MovieSvg from '../../../assets/movie.svg'
import AnimalsSvg from '../../../assets/animals.svg'
import BooksSvg from '../../../assets/books.svg'
import {View} from "react-native";
import DashboardItem from "./DashboardItem";
import {mainStyles} from "../../../styles/mainStyles";
import {useTheme} from "../../../components/ThemeProvider";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";

const ProductsIcon = sized(ProductsSvg, 24, 22)
const RestaurantsIcon = sized(RestaurantsSvg, 24)
const OthersIcon = sized(OthersSvg, 24)
const SportIcon = sized(SportSvg, 30)
const MobileIcon = sized(MobileSvg, 14, 24)
const HealthIcon = sized(HealthSvg, 24, 20)
const TravelIcon = sized(TravelSvg, 24, 20)
const TaxiIcon = sized(TaxiSvg, 24, 20)
const CommunalIcon = sized(CommunalSvg, 24, 20)
const AutoIcon = sized(AutoSvg, 24, 20)
const RepairIcon = sized(RepairSvg, 24, 20)
const ClothingIcon = sized(ClothingSvg, 24, 20)
const HouseIcon = sized(HouseSvg, 24, 20)
const MovieIcon = sized(MovieSvg, 24, 20)
const AnimalsIcon = sized(AnimalsSvg, 24, 20)
const BooksIcon = sized(BooksSvg, 24, 20)

const DashboardItems = ({categories, setSelectedScreen}) => {
  const {t} = useTranslation()
  const [pressedItem, setPressedItem] = useState(null)
  const items = [
    {
      label: t('Dashboard.products'),
      icon: <ProductsIcon/>,
      price: 'QAR 0 0%',
      colors: ['#FF4700', '#FF7600']
    },
    {
      label: t('Dashboard.restaurants'),
      icon: <RestaurantsIcon/>,
      price: 'QAR 0 0%',
      colors: ['#A983FF', '#5900FF']
    },
    {
      label: t('Dashboard.others'),
      icon: <OthersIcon/>,
      price: 'QAR 0 0%',
      colors: ['#C9C9C9', '#697E87']
    },
    {
      label: t('Dashboard.sport'),
      icon: <SportIcon style={{marginTop: 5}} />,
      price: 'QAR 0 0%',
      colors: ['#8DFFCD', '#00A757']
    },
    {
      label: t('Dashboard.mobile'),
      icon: <MobileIcon/>,
      price: 'QAR 0 0%',
      colors: ['#D2EDF8', '#618392']
    },
    {
      label: t('Dashboard.health'),
      icon: <HealthIcon/>,
      price: 'QAR 0 0%',
      colors: ['#DC5BFF', '#D300A4']
    },
    {
      label: t('Dashboard.travel'),
      icon: <TravelIcon/>,
      price: 'QAR 0 0%',
      colors: ['#2DD787', '#4D8C76']
    },
    {
      label: t('Dashboard.communal'),
      icon: <CommunalIcon/>,
      price: 'QAR 0 0%',
      colors: ['#3784FF', '#32BFFF']
    },
    {
      label: t('Dashboard.auto'),
      icon: <AutoIcon/>,
      price: '-QAR 0 0%',
      colors: ['#E18162', '#A23E1E']
    },
    {
      label: t('Dashboard.clothing'),
      icon: <ClothingIcon/>,
      price: '-QAR 0 0%',
      colors: ['#FFC450', '#EA7700']
    },
    {
      label: t('Dashboard.household'),
      icon: <HouseIcon/>,
      price: '-QAR 2 567 13%',
      colors: ['#FF68C3', '#FF7193']
    }
  ]

  return (
    <View style={[mainStyles.p20, {marginTop: 20}]}>
      {categories.map((item, i) => (
        <DashboardItem key={i} item={item} isPressed={pressedItem === i} setPressedItem={setPressedItem} index={i} setSelectedScreen={setSelectedScreen} />
      ))}
      <View style={{marginBottom: 150}}  />
    </View>
  );
};

const mapStateToProps = (state) => ({
  categories: state.merchantReducer.categories
})

export default connect(mapStateToProps, {})(DashboardItems)
