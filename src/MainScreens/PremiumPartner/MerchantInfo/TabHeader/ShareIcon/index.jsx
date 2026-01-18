import {StyleSheet, TouchableOpacity, View} from "react-native"
import {useTheme} from "../../../../../components/ThemeProvider"
import {colors} from "../../../../../components/colors";
import ShareSvg from '../../../../../assets/share.svg';
import {sized} from "../../../../../Svg";


const ShareIcon = ({onShare}) => {
    const {isDark} = useTheme();

    const ShareIcon = sized(ShareSvg, 20, 20, '#fff');

    const shareIconBorderColor = isDark ? colors.mainDarkMode : colors.darkBlue;

    return (
        <View
            style={styles.shareIconWrapper}
          >
            <TouchableOpacity
              onPress={onShare}
              style={[ styles.shareIcon, { borderColor: shareIconBorderColor }]}
            >
              <ShareIcon
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </TouchableOpacity>
          </View>
    )
};

const styles = StyleSheet.create({
shareIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDFE4",
    borderRadius: 50,
    backgroundColor: null,
    borderWidth: 1.5,
  },
  shareIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});

export default ShareIcon;