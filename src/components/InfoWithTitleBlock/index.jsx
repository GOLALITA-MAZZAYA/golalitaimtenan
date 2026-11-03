import {StyleSheet, TouchableOpacity, View} from "react-native"
import {isRTL} from "../../../utils";
import {colors} from "../colors";
import {TypographyText} from "../Typography";
import {BALOO_2} from "../../redux/types";
import ArrowRightSvg from '../../assets/loyaltyPoints/rightArrow.svg'
import {useState} from "react";
import { useTranslation } from "react-i18next";
import HTMLView from "react-native-htmlview";
import Button from "../Button";
import { handleSafeLinkPress } from "../HTMLRenderer";
import { useTheme } from "../ThemeProvider";


export const getHtmlStyleSheet = ( language) => {
  const styles = {
    div: {
      color: colors.loyaltyTextSecondary,
    },
    a: {
      color: colors.loyaltyTextSecondary,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: colors.loyaltyTextSecondary,
    },
  };

  if (language === "ar") {
    styles["span"] = {
      textAlign: "right",
    };
    styles["p"] = {
      textAlign: "right",
    };
    styles["div"] = {
      textAlign: "right",
    };
    // styles["a"] = {
    //   textAlign: "right",
    // };
    styles["li"] = {
      textAlign: "right",
    };
    styles["ol"] = {
      textAlign: "right",
    };
    styles["ul"] = {
      textAlign: "right",
    };
  }

  return styles;
};

const HTMLRenderer = ({ value, ...restProps }) => {
  const { i18n } = useTranslation();

  return (
    <HTMLView
      value={value}
      stylesheet={getHtmlStyleSheet( i18n.language)}
      addLineBreaks={true}
      paragraphBreak={false}
      textComponentProps={{
        style: {
          color: colors.loyaltyTextSecondary
        },
      }}
      onLinkPress={handleSafeLinkPress}
      {...restProps}
    />
  );
};



const COLLAPSED_DESCRIPTION_LENGTH = 200;

const InfoWithTitleBlock = ({icon, title, description, style, html, onPress, shortVersion, shortVersionTitle}) => {
    const isDescriptionTooLong = description?.length > COLLAPSED_DESCRIPTION_LENGTH;
    const [isCollapsed, setIsCollapsed] = useState(isDescriptionTooLong);
    const isRtl = isRTL();
    const { isDark } = useTheme();
    
    const updatedDescription = isDescriptionTooLong && isCollapsed && !html ?  description.slice(0,COLLAPSED_DESCRIPTION_LENGTH) + ' ...' : description;

    return (
        <TouchableOpacity 
         onPress={onPress}
         activeOpacity={onPress ? 0.7 : 1}
         disabled={!onPress}
         style={[
           styles.wrapper,
           {
             backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
             borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
           },
           style
         ]}>
            <View style={[styles.header, {flexDirection: isRtl ? 'row-reverse' : 'row'}]}>
                {!!icon && (
                  <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(221, 189, 107, 0.12)' : 'rgba(162, 148, 117, 0.12)' }]}>
                    {icon}
                  </View>
                )}

                <TypographyText 
                   title={title}
                   font={BALOO_2}
                   size={14}
                   textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                   style={[styles.title, { marginLeft: isRtl ? 0 : 8, marginRight: isRtl ? 8 : 0 }]}
                />
            </View>

            <View style={styles.descriptionWrapper}>
                {!html && <TypographyText 
                   title={shortVersionTitle ? shortVersionTitle : updatedDescription}
                   font={BALOO_2}
                   size={15}
                   textColor={isDark ? '#FFFFFF' : '#1C1C1E'}
                   style={[styles.description, { fontWeight: '700' }]}
                   numberOfLines={shortVersion ? 1 : undefined}
                />}

                {!!html && ( 
                    <View style={{height: isCollapsed ? 100 : undefined, overflow: 'hidden'}}>
                      <HTMLRenderer value={description}/>
                    </View>
                )}

                {!!isDescriptionTooLong && <TouchableOpacity style={[
                    styles.arrowBlock,
                    {transform: [
                       { rotate: isCollapsed ? "90deg" : '270deg'},
                     ]}
                    ]}
                    hitSlop={20}
                onPress={() => setIsCollapsed(prev => !prev)}
                >
                     <ArrowRightSvg color={isDark ? colors.mainDarkMode : colors.darkBlue}/>
                </TouchableOpacity>}
            </View>

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBadge: {
      width: 32,
      height: 32,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowBlock: {
      alignSelf: 'center',
      transform: [
        { rotate: "90deg"},
      ],
      marginTop: 10
    },
    title: {
      fontWeight: '600',
    },
    descriptionWrapper: {
      marginTop: 8,
    },
    description: {
      lineHeight: 22,
    }
});

export default InfoWithTitleBlock;


