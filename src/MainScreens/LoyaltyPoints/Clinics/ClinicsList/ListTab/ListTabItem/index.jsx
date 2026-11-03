import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../../components/AppImage";
import { TypographyText } from "../../../../../../components/Typography";
import { colors } from "../../../../../../components/colors";
import {BALOO_2} from "../../../../../../redux/types";
import {isRTL} from "../../../../../../../utils";
import ArrowSvg from '../../../../../../assets/loyaltyPoints/rightArrow.svg';
import StarFilledSvg from '../../../../../../assets/star-filled.svg';
import LocationSvg from '../../../../../../assets/location.svg'
import ClockSvg from '../../../../../../assets/clinics/clock.svg';


const IMAGE_HEIGHT = 195;
const IMAGE_RADIUS = 38;

const ListTabItem = ({ onPress, logo, style, tags, time, onArrowPress, rating, address, name }) => {
  const isRtl = isRTL();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, {borderColor: colors.loyaltyMainBorder, backgroundColor: colors.loyaltyCardBackground}, style]}>

      <Image
        source={{ uri:logo }}
        style={styles.backgroundImage}
        contentFit="fill"
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
                    left: isRtl ? 20: 'auto',
                    right: isRtl ? 'auto': 20,
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


      <View style={[styles.descriptionBlock, { backgroundColor: colors.loyaltyCardBackground }]}>

        <View style={[styles.nameBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <TypographyText 
              size={20}
              textColor={colors.loyaltyTextMainTitle}
              font={BALOO_2}
              style={styles.name}
              title={name}
              numberOfLines={2}
            />


            <View style={[styles.timeBlock,{flexDirection: isRtl ? 'row-reverse': 'row', borderColor: colors.primaryBorderLight, backgroundColor: colors.smallCardBackground}]}>
                     <ClockSvg color={colors.primary}/>

                     <TypographyText 
                       title={time}
                       font={BALOO_2}
                       size={12}
                       style={{...styles.timeText, marginLeft: isRtl ? 0: 5, marginRight: isRtl? 5: 0}}
                       textColor={colors.loyaltyPrimary}
                     />
            </View>
        </View>

        {address && <View style={[styles.addressBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
            <LocationSvg color={colors.loyaltyPrimary} />

            <TypographyText 
              size={14}
              textColor={colors.loyaltyPrimary}
              font={BALOO_2}
              style={styles.addressText}
              title={address}
            />
        </View>}

        {!!tags?.length && <View style={[styles.tags,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
        {tags?.map(name => (
              <View style={[styles.tag,{backgroundColor: colors.loyaltyTabsBackground, marginRight: isRtl? 0: 5, marginLeft: isRtl ? 5: 0}]}>
              
            <TypographyText 
              size={12}
              textColor={colors.tagsColor}
              font={BALOO_2}
              style={styles.addressText}
              title={name}
            />
              </View>
        ))}
        </View>}

      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: IMAGE_RADIUS,
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
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 16,
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
    alignItems: 'center',
    marginTop: 10,
  },
  addressText: {
    marginHorizontal: 8,
    fontWeight: '600'
  },
  ribbon: {
     paddingHorizontal: 12,
     paddingVertical: 5,
     borderRadius: 20,
     position: 'absolute',
     top: 15,
     borderWidth: 1,
     gap: 6
  },
  nameBlock: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '700',
    flex: 1,
    flexShrink: 1
  },
  tags: {
    flexWrap: 'wrap'
  },
  tag: {
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 2
  },
  timeBlock: {
    borderWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 16,
    alignItems: 'center'
  },
  timeText: {

  }

});

export default ListTabItem;
