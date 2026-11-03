import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import {BALOO_2} from "../../../../../redux/types";
import {isRTL} from "../../../../../../utils";
import ArrowSvg from '../../../../../assets/loyaltyPoints/rightArrow.svg';

const IMAGE_HEIGHT = 195;
const IMAGE_RADIUS = 38;

const ListItem = ({ onPress, logo, style,  description, name }) => {
  const isRtl = isRTL();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, {borderColor: colors.loyaltyMainBorder, backgroundColor: colors.loyaltyCardBackground}, style]}>

      <Image
        source={{ uri:logo }}
        style={styles.backgroundImage}
        contentFit="fill"
      />

      <View style={[styles.arrow,{right: isRtl ? undefined: 20, left: isRtl ? 20: undefined, transform: [{ rotate: isRtl ?  "180deg": '0deg' }]}]} >
        <ArrowSvg color={colors.loyaltyTextMain}/>
      </View>


      <View style={[styles.descriptionBlock, { backgroundColor: colors.loyaltyCardBackground }]}>

          <TypographyText 
              size={18}
              textColor={colors.loyaltyTextMainTitle}
              font={BALOO_2}
              style={styles.descriptionText}
              title={name}
            />

        {description && <View style={[styles.addressBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <TypographyText 
              size={14}
              textColor={colors.loyaltyPrimary}
              font={BALOO_2}
              style={styles.descriptionText}
              title={description}
            />
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
  addressBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  descriptionText: {
    marginHorizontal: 8,
    fontWeight: '600'
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
  timeBlock: {
    borderWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 16,
    alignItems: 'center'
  },

});

export default ListItem;
