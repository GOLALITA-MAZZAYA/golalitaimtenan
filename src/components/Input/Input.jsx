import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../colors';
import { LUSAIL_REGULAR } from '../../redux/types';
import { mainStyles } from '../../styles/mainStyles';
import { TypographyText } from '../Typography';
import EyeSvg from '../../assets/view.svg';
import { useTheme } from '../ThemeProvider';
import FlagModal from '../FlagModal/FlagModal';
import { getTextAlign, isRTL } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { sized } from '../../Svg';

const Input = ({
  label,
  wrapperStyle,
  style,
  height,
  icon,
  innerRef,
  errorMarginTop,
  onPress,
  disableInputRtl,
  labelColor,
  showLabel,
  hideLabel,
  ...props
}) => {
  const { t } = useTranslation();
  const [isShowPassword, setIsShowPassword] = useState(
    props.secureTextEntry ?? false,
  );
  const { isDark } = useTheme();
  const isRtl = !disableInputRtl && isRTL();
  style = {
    ...style,
    backgroundColor: isDark ? colors.darkModeBackground : colors.white,
    color: isDark ? colors.darkGrey : colors.darkBlue,
  };

  const EyeIcon = sized(EyeSvg, 23, 20, '#999CAD');
  const EyeActiveIcon = sized(
    EyeSvg,
    23,
    20,
    isDark ? colors.mainDarkMode : colors.darkBlue,
  );

  const isShowSecurityIcon = () => {
    if (Platform.OS === 'android') {
      const { secureTextEntry, keyboardType } = props;

      if (keyboardType === 'visible-password' && secureTextEntry) {
        return false;
      }

      return secureTextEntry;
    }

    return props.secureTextEntry;
  };

  const getLabelColor = () => {
    if (props.error) {
      return '#FF406E';
    }

    if (labelColor) {
      return labelColor;
    }

    return isDark ? colors.darkGrey : colors.darkBlue;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (onPress) onPress();
      }}
      style={[styles.wrapper, wrapperStyle]}
    >
      <TypographyText
        title={
          hideLabel ||
            (!showLabel &&
              (label === t('ContactUs.mobileNumber') ||
                label === t('Login.password') ||
                label === t('Profile.confirmPassword')))
            ? ''
            : label
        }
        textColor={getLabelColor()}
        size={14}
        font={LUSAIL_REGULAR}
        style={{
          marginBottom: 3,
          width: '100%',
          textAlign: isRTL() ? 'right' : 'left',
          fontWeight: '700',
        }}
      />

      {isShowSecurityIcon() && (
        <TouchableOpacity
          onPress={() => setIsShowPassword(!isShowPassword)}
          style={[
            {
              position: 'absolute',
              top: 32,
              zIndex: 1000,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            },
            isRTL() ? { left: 15 } : { right: 15 },
          ]}
        >
          {!isShowPassword ? <EyeActiveIcon /> : <EyeIcon />}
        </TouchableOpacity>
      )}
      <View style={{ position: 'relative' }}>
        {label === t('ContactUs.mobileNumber') ? (
          <FlagModal
            style={[
              styles.input,
              style,
              props.error && styles.error,
              { borderColor: isDark ? colors.darkGrey : 'transparent' },
            ]}
            ref={innerRef}
            disableRtl={disableInputRtl}
            placeholderTextColor={isDark ? colors.darkGrey : colors.lightGrey}
            textStyle={[
              style,
              {
                fontFamily: LUSAIL_REGULAR,
                fontSize: 14,
                backgroundColor: colors.transparent,
              },
              isRtl && { textAlign: 'right', marginRight: 40 },
              isDark && { color: colors.darkGrey },
            ]}
            {...props}
          />
        ) : (
          <TextInput
            placeholderTextColor={isDark ? colors.darkGrey : colors.lightGrey}
            multiline={height !== undefined}
            ref={innerRef}
            style={[
              styles.input,
              style,
              height && { height },
              props.error && [
                styles.error,
                isDark && { backgroundColor: colors.transparent },
              ],
              icon && { paddingLeft: 45 },
              getTextAlign(),
              Platform.OS === 'android' &&
              props.secureTextEntry && { elevation: 2 },
              { borderColor: isDark ? colors.darkGrey : 'transparent' },
            ]}
            selection={undefined}
            {...props}
            secureTextEntry={isShowPassword}
          />
        )}
        <View style={{ position: 'absolute', left: 15, top: 5 }}>{icon}</View>
        {props.error && (
          <TypographyText
            title={props.error}
            textColor={'#FF406E'}
            size={14}
            font={LUSAIL_REGULAR}
            style={{ fontWeight: '700', marginTop: errorMarginTop ?? 3 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  input: {
    ...mainStyles.lightShadow,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontFamily: LUSAIL_REGULAR,
    fontSize: 18,
    height: 52,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    textAlign: 'left',
    zIndex: 0,
  },
  error: {
    backgroundColor: '#FFEBEB',
    borderColor: '#FF406E',
  },
});

export default React.memo(Input);
