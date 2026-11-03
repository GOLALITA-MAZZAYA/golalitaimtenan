import React from "react";
import {StyleSheet, TouchableOpacity} from "react-native"
import {TypographyText} from "../../Typography";
import {colors} from "../../colors";
import {isRTL} from "../../../../utils";
import {BALOO_2} from "../../../redux/types";

const CustomBtnWithIcon = ({onPress, icon, title}) => {
    const isRtl = isRTL();

    return (
        <TouchableOpacity
                 style={[
                          styles.tab,
                          {
                            flexDirection: isRtl ? 'row-reverse': 'row',
                            backgroundColor: colors.btnPrimaryBtnBackground,
                            borderColor:  colors.mainBorder,
                            marginLeft: isRtl ? 8: 0, marginRight: isRtl? 0 : 8
                          },
                        ]}
                        onPress={onPress}
                >
                        {icon &&
                           React.cloneElement(icon, {
                             color: colors.btnPrimaryBtnText,
                             height: 19,
                             width: 19
                        })}
                        <TypographyText
                          textColor={colors.btnPrimaryBtnText}
                          size={16}
                          style={{ fontWeight: '500' , marginLeft: isRtl ? 0: 4, marginRight: isRtl? 4 : 0}}
                          title={title}
                          font={BALOO_2}
                        />
       </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 25,
  }, 
  tab: {
    height: 46,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    flex: 1,
  },
});

export default CustomBtnWithIcon;