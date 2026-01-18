import React from 'react';
import { Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import { sized } from '../../Svg';
import { colors } from '../../components/colors';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { TypographyText } from '../../components/Typography';
import { useTheme } from '../../components/ThemeProvider';
import { connect } from 'react-redux';
import { contactUs } from '../../redux/auth/auth-thunks';
import { useTranslation } from 'react-i18next';
import CallSvg from '../../assets/callf.svg';
import MailSvg from '../../assets/mailf.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isRTL } from '../../../utils';
import Header from '../../components/Header';

const ContactUs = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const mainColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const CallIcon = sized(CallSvg, 23, 23, iconColor);
  const MailIcon = sized(MailSvg, 23, 23, iconColor);

  const handlePhonePress = phone => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderInfo = (item, title) => {
    return (
      <View style={styles.infoItem}>
        <View style={styles.infoItemTitleWrapper}>
          <View
            style={[
              styles.infoItemTitle,
              {
                flexDirection: isRTL() ? 'row-reverse' : 'row',
              },
            ]}
          >
            <CallIcon />
            <TypographyText
              textColor={mainColor}
              size={20}
              font={BALOO_SEMIBOLD}
              style={{ fontWeight: '700', marginHorizontal: 11 }}
              title={item}
            />
          </View>
        </View>
        <TypographyText
          title={t('ContactUs.visit')}
          textColor={mainColor}
          size={16}
          font={BALOO_SEMIBOLD}
          style={styles.visitText}
        />
        <View style={styles.valuesWrapper}>
          {title &&
            title.map(i => {
              return (
                <View
                  style={[
                    styles.infoItemValueContainer,
                    {
                      borderColor: isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue,
                    },
                  ]}
                >
                  <TypographyText
                    textColor={mainColor}
                    size={19}
                    font={BALOO_REGULAR}
                    title={i}
                    style={styles.infoItemValue}
                    onPress={() => handlePhonePress(i)}
                  />
                </View>
              );
            })}
        </View>
      </View>
    );
  };

  const renderInfoEmail = (item, title) => {
    return (
      <View style={styles.infoItem}>
        <View style={styles.infoItemTitleWrapper}>
          <View
            style={[
              styles.infoItemTitle,
              {
                flexDirection: isRTL() ? 'row-reverse' : 'row',
              },
            ]}
          >
            <MailIcon />
            <TypographyText
              textColor={mainColor}
              size={20}
              font={BALOO_SEMIBOLD}
              style={{ fontWeight: '700', marginHorizontal: 11 }}
              title={item}
            />
          </View>
        </View>

        <View style={styles.emailWrapper}>
          <View
            style={[styles.infoItemValueContainer, { borderColor: mainColor }]}
          >
            <TypographyText
              textColor={mainColor}
              size={19}
              font={BALOO_REGULAR}
              title={title}
              onPress={() => Linking.openURL(`mailto:support@golalita.com`)}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          backgroundColor: isDark ? colors.darkBlue : colors.white,
          flex: 1,
        }}
      >
        <SafeAreaView>
          <Header label={t('ContactUs.contactUs')} />

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoWrapper}>
              {renderInfo(t('ContactUs.callCenter'), [
                '0097441410399',
                '0097441410398',
              ])}

              {renderInfoEmail(
                t('ContactUs.email'),
                ['support@golalita.com'],
                () => {
                  Linking.openURL(`mailto:support@golalita.com`);
                },
              )}
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  infoWrapper: {
    paddingHorizontal: 20,
  },
  infoItem: {
    borderRadius: 10,
    marginTop: 25,
  },
  infoItemTitleWrapper: {},
  infoItemTitle: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoItemValue: {
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  infoItemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 33,
  },
  visitText: {
    marginTop: 25,
  },
  valuesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    flex: 1,
    marginTop: 25,
  },
  emailWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

const mapStateToProps = state => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, { contactUs })(ContactUs);
