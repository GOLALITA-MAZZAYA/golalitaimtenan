import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";
import ArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';
import StarFilledSvg from '../../../../assets/star-filled.svg';
import LocationSvg from '../../../../assets/location.svg'
import useMerchantDiscount from "../../../../hooks/useMerchantDiscount";

const IMAGE_HEIGHT = 195;
const IMAGE_RADIUS = 38;

const HotelsListCard = ({ onPress, uri, style, description, onArrowPress, rating, address, merchantId }) => {
  const isRtl = isRTL();

  const {loading , discount} = useMerchantDiscount(merchantId);
  const ribbon = isRtl ? discount?.x_ribbon_text_arabic : discount?.ribbon_text;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, {borderColor: colors.loyaltyMainBorder, backgroundColor: colors.loyaltyCardBackground}, style]}>

      <Image
        source={{ uri }}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />

      <TouchableOpacity style={[styles.arrow,{right: isRtl ? undefined: 20, left: isRtl ? 20: undefined, transform: [{ rotate: isRtl ?  "180deg": '0deg' }]}]} onPress={onArrowPress}>
        <ArrowSvg color={colors.loyaltyTextMain}/>
      </TouchableOpacity>

      {!!rating && <View style={[
                  styles.ratingBlock,
                  { 
                    flexDirection: isRtl ? 'row-reverse': 'row',
                    backgroundColor: colors.loyaltyCardBackground,
                    borderColor: colors.loyaltyMainBorder,
                    left: isRtl ? 'auto': 20,
                    right: isRtl ? 20: 'auto',
                    borderColor: colors.loyaltyMainBorder
                  }]}
                    >
                     <StarFilledSvg color={colors.loyaltyPrimary}/>
                     <TypographyText 
                       title={rating}
                       font={BALOO_2}
                       size={12}
                       style={styles.ratingText}
                       textColor={colors.loyaltyTextMainTitle}
                     />
        </View>}

      {ribbon && <View style={[
         styles.ribbon,
         { 
          backgroundColor: colors.loyaltyCardBackground,
          borderColor: colors.loyaltyMainBorder,
          left: isRtl ? 20: 'auto',
          right: isRtl ? 'auto': 20,
          borderColor: colors.loyaltyMainBorder
        }
       ]}>
          <TypographyText 
              title={ribbon}
              font={BALOO_2}
              size={12}
              style={styles.ratingText}
              textColor={colors.loyaltyTextMainTitle}
           />
      </View>}


      <View style={[styles.descriptionBlock, { backgroundColor: colors.loyaltyCardBackground }]}>
        <View style={styles.nameWrapper}>
          <TypographyText
            title={description}
            size={18}
            style={styles.pointsBlockText}
            textColor={colors.loyaltyTextMainTitle}
            numberOfLines={2}
            font={BALOO_2}
          />
        </View>

        {address && <View style={[styles.addressBlock,{justifyContent: isRtl ? 'flex-end': 'flex-start'}]}>
            <LocationSvg color={colors.loyaltyPrimary} />

            <TypographyText 
              size={12}
              textColor={colors.loyaltyPrimary}
              font={BALOO_2}
              style={styles.addressText}
              title={address}
            />
        </View>}

      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: IMAGE_RADIUS,
    height: 280,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 20
  },

  backgroundImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderTopLeftRadius: IMAGE_RADIUS,
    borderTopRightRadius: IMAGE_RADIUS,
  },

  descriptionBlock: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: IMAGE_RADIUS,
    borderBottomRightRadius: IMAGE_RADIUS,
  },

  nameWrapper: {
    flex: 1,
    marginRight: 12,
    overflow: "hidden",
  },

  pointsBlock: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: 'flex-end',
    marginBottom: 10
  },
  arrow: {
    position: 'absolute',
    top: 100
  },
  ratingBlock: {
     paddingHorizontal: 12,
     paddingVertical: 5,
     borderRadius: 20,
     position: 'absolute',
     top: 15,
     borderWidth: 1,
     gap: 6
  },
  ratingText: {
    fontWeight: '700'
  },
  addressBlock: {
    alignItems: 'center'
  },
  addressText: {
    marginHorizontal: 8
  },
  ribbon: {
     paddingHorizontal: 12,
     paddingVertical: 5,
     borderRadius: 20,
     position: 'absolute',
     top: 15,
     borderWidth: 1,
     gap: 6
  }
});

export default HotelsListCard;
