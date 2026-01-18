import MP4Slider from "../../../../components/MP4Slider";
import {HOME_BANNERS} from "./config";

const LoyaltyPointsBanners = ({style}) => {
   return (
      <MP4Slider 
         data={HOME_BANNERS}
         style={style}
      />
   )
};

export default LoyaltyPointsBanners;