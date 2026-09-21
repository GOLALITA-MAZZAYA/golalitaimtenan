import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import ListNoData from '../../components/ListNoData';
import { getEsimCompatibleDevices } from '../../api/esim';
import { isRTL } from '../../../utils';

const ESimHelpDevices = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounce = useRef(null);

  const load = useCallback(async keyword => {
    setLoading(true);
    try {
      const data = await getEsimCompatibleDevices({
        search: keyword || undefined,
      });
      setDevices(data?.devices || []);
    } catch (error) {
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load('');
  }, [load]);

  return (
    <MainLayout
      outsideScroll
      headerChildren={
        <Header label={t('ESimHelp.searchDevices')} btns={['back']} />
      }
      headerHeight={50}
      contentStyle={styles.content}
    >
      <TypographyText
        title={t('ESimHelp.searchDevicesHint')}
        size={14}
        font={LUSAIL_REGULAR}
        textColor={isDark ? '#B1B1B4' : '#616060'}
        style={{ marginBottom: 16, lineHeight: 20 }}
      />
      <TextInput
        value={search}
        onChangeText={text => {
          setSearch(text);
          if (debounce.current) {
            clearTimeout(debounce.current);
          }
          debounce.current = setTimeout(() => load(text), 350);
        }}
        placeholder={t('ESim.searchDevice')}
        placeholderTextColor={isDark ? colors.white : colors.lightGrey}
        style={[
          styles.search,
          {
            backgroundColor: isDark ? colors.navyBlue : colors.white,
            borderColor: isDark ? colors.navyBlue : colors.lightGrey,
            color: isDark ? colors.white : colors.mainDarkModeText,
            textAlign: isRTL() ? 'right' : 'left',
          },
        ]}
      />
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 30 }}
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item, index) => `${item.brand}-${item.name}-${index}`}
          ListEmptyComponent={<ListNoData />}
          renderItem={({ item }) => (
            <View
              style={[
                styles.row,
                {
                  borderBottomColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <TypographyText
                title={item.name}
                size={15}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ flex: 1 }}
              />
              <TypographyText
                title={item.brand}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={isDark ? '#8E8E93' : '#6B7280'}
              />
            </View>
          )}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  search: {
    height: 46,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});

export default ESimHelpDevices;
