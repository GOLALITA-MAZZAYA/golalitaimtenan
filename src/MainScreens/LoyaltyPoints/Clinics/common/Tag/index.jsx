import {StyleSheet, View} from "react-native"
import {TypographyText} from "../../../../../components/Typography"
import {BALOO_2} from "../../../../../redux/types"
import {colors} from "../../../../../components/colors"
import {isRTL} from "../../../../../../utils";

const Tag = ({text, style={}, icon}) => {
    const isRtl = isRTL();

    return (
        <View style={{...styles.tag, flexDirection: isRtl ? 'row-reverse': 'row', alignItems: 'center', backgroundColor: colors.smallCardBackground, ...style}}>

                   {!!icon && icon}
                      
                    <TypographyText 
                      size={11}
                      textColor={style.color ? style.color : colors.tagsColor}
                      font={BALOO_2}
                      style={{...styles.text, marginLeft: icon ? isRtl ? 0: 5: 0, marginRight: icon ? isRtl ? 5 : 0 : 0 }}
                      title={text}
                    />
        </View>
    )
};

const styles = StyleSheet.create({
   text: {
    marginHorizontal: 8,
    fontWeight: '600'
  },
   tag: {
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});

export default Tag