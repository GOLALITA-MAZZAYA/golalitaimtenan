import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
import { sized } from '../../Svg';
import SearchSvg from '../../assets/search.svg';
import ArrowSvg from '../../assets/loyaltyPoints/rightArrow.svg';
import { getAllEsimDestinations } from '../../api/esim';
import { splitDestinations } from './esimUtils';
import { isRTL } from '../../../utils';

const TABS = [
  { labelKey: 'ESim.local', value: 'local' },
  { labelKey: 'ESim.regional', value: 'regional' },
];

const DestinationRow = ({ item, isDark, onPress }) => {
  const rtl = isRTL();
  const Chevron = sized(
    ArrowSvg,
    14,
    14,
    isDark ? colors.mainDarkMode : colors.darkBlue,
  );

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          borderBottomColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
        },
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image_url }}
        style={[styles.flag, rtl && styles.flagRtl]}
      />
      <TypographyText
        title={item.name}
        textColor={isDark ? colors.white : colors.black}
        size={16}
        font={LUSAIL_REGULAR}
        style={styles.rowTitle}
      />
      <View style={rtl ? styles.chevronRtl : styles.chevron}>
        <Chevron />
      </View>
    </TouchableOpacity>
  );
};

const ESimCountries = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [type, setType] = useState('local');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const debounce = useRef(null);
  const SearchIcon = sized(
    SearchSvg,
    18,
    18,
    isDark ? colors.white : colors.darkBlue,
  );

  const load = useCallback(async (nextType, keyword) => {
    setLoading(true);
    try {
      const data = await getAllEsimDestinations({
        type: nextType,
        search: keyword || undefined,
      });
      setItems(data?.items || []);
    } catch (error) {
      console.log(error,'error')
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(type, search);
  }, [type, load]);

  const onSearchChange = text => {
    setSearch(text);
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(() => {
      load(type, text);
    }, 350);
  };

  const openDestination = item => {
    navigation.navigate('ESimPlans', { destination: item });
  };

  const { popular, rest } = splitDestinations(items);
  const sections = [];
  if (popular.length) {
    sections.push({ title: t('ESim.popularCountries'), data: popular });
  }
  if (rest.length) {
    sections.push({ title: t('ESim.allCountries'), data: rest });
  } else if (!popular.length && items.length) {
    sections.push({ title: t('ESim.allCountries'), data: items });
  }

  const listData = sections.flatMap(section => [
    { _type: 'header', id: `h-${section.title}`, title: section.title },
    ...section.data.map(item => ({ ...item, _type: 'item' })),
  ]);

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.chooseCountry')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.search,
          {
            backgroundColor: isDark ? colors.navyBlue : colors.white,
            borderColor: isDark ? colors.navyBlue : colors.lightGrey,
            flexDirection: isRTL() ? 'row-reverse' : 'row',
          },
        ]}
      >
        <SearchIcon />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder={t('ESim.search')}
          placeholderTextColor={isDark ? colors.white : colors.lightGrey}
          style={[
            styles.input,
            {
              color: isDark ? colors.white : colors.mainDarkModeText,
              textAlign: isRTL() ? 'right' : 'left',
              marginLeft: isRTL() ? 0 : 8,
              marginRight: isRTL() ? 8 : 0,
            },
          ]}
        />
      </View>

      <View style={[styles.tabs, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
        {TABS.map(tab => {
          const active = type === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tab,
                active &&
                  (isDark ? styles.tabActiveDark : styles.tabActiveLight),
              ]}
              onPress={() => setType(tab.value)}
            >
              <TypographyText
                title={t(tab.labelKey)}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={
                  active
                    ? isDark
                      ? colors.mainDarkModeText
                      : colors.white
                    : isDark
                    ? colors.white
                    : colors.darkBlue
                }
                style={active ? styles.tabActiveText : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={listData}
          keyExtractor={item => String(item.id || item.title)}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ListNoData
              text={
                search.trim()
                  ? t('ESim.noCountriesFound')
                  : t('ESim.noCountries')
              }
            />
          }
          renderItem={({ item }) =>
            item._type === 'header' ? (
              <TypographyText
                title={item.title}
                size={18}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={styles.sectionTitle}
              />
            ) : (
              <DestinationRow
                item={item}
                isDark={isDark}
                onPress={openDestination}
              />
            )
          }
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  tabActiveLight: {
    backgroundColor: colors.darkBlue,
  },
  tabActiveDark: {
    backgroundColor: colors.mainDarkMode,
  },
  tabActiveText: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  flag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#333',
  },
  flagRtl: {
    marginRight: 0,
    marginLeft: 12,
  },
  rowTitle: {
    flex: 1,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRtl: {
    marginLeft: 16,
    marginRight: 4,
  },
});

export default ESimCountries;
