import React, { useCallback, useState } from 'react';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import { colors } from '../../components/colors';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { mainStyles } from '../../styles/mainStyles';
import { sized } from '../../Svg';
import PremiumSvg from '../../assets/premium.svg';
import PresentSvg from '../../assets/present.svg';
import IconButton from '../../components/IconButton/IconButton';
import PresentActiveSvg from '../../assets/presend_active.svg';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { TypographyText } from '../../components/Typography';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import CommonButton from '../../components/CommonButton/CommonButton';
import { getFlexDirection } from '../../../utils';
import { useTheme } from '../../components/ThemeProvider';
import { connect } from 'react-redux';
import { redeem } from '../../redux/merchant/merchant-thunks';
import Select from '../../components/Form/Select';

const PresentIcon = sized(PresentSvg, 13);

const PremiumIcon = sized(PremiumSvg, 24);
const PresentActiveIcon = sized(PresentActiveSvg, 13);

const checkSubmitDisabled = (branchesOptions, selectedBranch, code) => {
  if (branchesOptions?.length && !selectedBranch) {
    return true;
  }

  if (code.length < 4) {
    return true;
  }

  return false;
};

const getBranchesOptions = (branches, isB1G1, language) => {
  if (!isB1G1 || !branches?.length) {
    return [];
  }

  return branches.map(item => ({
    value: item.merchant_id,
    label: language === 'ar' ? item.merchant_name_ar : item.merchant_name,
  }));
};

const Promocode = ({ route, navigation, redeem }) => {
  let params = route?.params;
  const [code, setCode] = useState('');
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [selectedBranch, selectBranch] = useState(null);

  const toContactUs = useCallback(() => {
    navigation.navigate('ContactUs');
  }, []);

  const branchesOptions = getBranchesOptions(
    params?.branches,
    params.isB1G1,
    language,
  );
  const isSubmitDisabled = checkSubmitDisabled(
    branchesOptions,
    selectedBranch,
    code,
  );
  function getBranchName(value) {
    const branch = branchesOptions.find(branch => branch.value === value);
    return branch && branch.label;
  }
  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView>
        <CommonHeader
          isWhite={isDark}
          label={getBranchName(selectedBranch) || params?.merchant_name}
        />
        <ScrollView>
          <View style={mainStyles.p20}>
            <View
              style={[
                styles.container,
                { backgroundColor: isDark ? colors.darkBlue : colors.white },
              ]}
            >
              <View style={[mainStyles.betweenRow, getFlexDirection()]}>
                <View style={{ position: 'relative' }}>
                  <PremiumIcon style={styles.icon} />
                  <Image
                    source={{ uri: params?.merchant_logo }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 50,
                      backgroundColor: 'white',
                    }}
                  />
                </View>
                <IconButton
                  color={isDark ? colors.white : null}
                  icon={isDark ? <PresentActiveIcon /> : <PresentIcon />}
                  label={t('ProductPage.redeem')}
                />
              </View>
              <TypographyText
                textColor={!isDark ? colors.darkBlue : colors.white}
                size={24}
                font={BALOO_SEMIBOLD}
                title={params?.name}
                style={mainStyles.centeredText}
              />
              <TypographyText
                textColor={!isDark ? colors.darkBlue : colors.white}
                size={18}
                font={BALOO_REGULAR}
                title={t('PremiumPartner.promoCodeDescription', {
                  name: params?.name,
                })}
                style={[mainStyles.centeredText, { marginBottom: 20 }]}
              />

              {!!branchesOptions?.length && (
                <Select
                  name="branches-select"
                  placeholder={t('PremiumPartner.branchPlaceholder')}
                  value={selectedBranch}
                  onChange={selectBranch}
                  onClearPress={() => {
                    selectBranch(null);
                  }}
                  single={true}
                  options={branchesOptions}
                  allowClear
                />
              )}

              <TypographyText
                textColor={!isDark ? colors.darkBlue : colors.white}
                size={12}
                font={BALOO_REGULAR}
                title={t('PremiumPartner.askEnterPin', {
                  name: getBranchName(selectedBranch) || params?.merchant_name,
                })}
              />

              <CodeField
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={setCode}
                cellCount={4}
                rootStyle={styles.codeWrapper}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[
                      styles.cell,
                      isFocused && styles.focusCell,
                      isDark && {
                        borderColor: colors.white,
                        color: colors.white,
                      },
                    ]}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              <TypographyText
                textColor={!isDark ? colors.darkBlue : colors.white}
                size={12}
                font={BALOO_REGULAR}
                title={t('PremiumPartner.applyThePromo', {
                  name: getBranchName(selectedBranch) || params?.merchant_name,
                })}
                style={[mainStyles.centeredText, styles.codeWrapper]}
              />
              <CommonButton
                disabled={isSubmitDisabled}
                label={t('ProductPage.redeem')}
                style={[
                  styles.codeWrapper,
                  isSubmitDisabled && { opacity: 0.7 },
                ]}
                onPress={() => {
                  redeem(
                    {
                      merchant_code: code,
                      product_id: params?.id,
                      merchant_id: selectedBranch
                        ? selectedBranch
                        : params.merchant_id,
                    },
                    t,
                    navigation,
                  );
                }}
              />
              <View style={[mainStyles.centeredRow, { marginTop: 30 }]}>
                <IconButton
                  onPress={toContactUs}
                  color={isDark ? colors.white : null}
                  label={t('PremiumPartner.reportAnIssue')}
                />
              </View>
              {params?.expiryDate && (
                <TypographyText
                  textColor={!isDark ? colors.grey : colors.white}
                  size={12}
                  font={BALOO_REGULAR}
                  title={`${t('PremiumPartner.validTill')} ${
                    params?.expiryDate
                  }`}
                  style={[mainStyles.centeredText, { marginTop: 20 }]}
                />
              )}
              <TouchableOpacity style={styles.rulesWrapper}>
                <Text style={styles.label}>
                  {t('PremiumPartner.rulesOfUse')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default connect(null, { redeem })(Promocode);
