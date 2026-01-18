import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  FlatList,
} from 'react-native';
import type { RootStackParamList } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/Header';
import { useQuery } from 'react-query';
import { getAllCategories } from '../../../api/categories';
import { colors } from '../../../components/colors';
import Slider from '@react-native-community/slider';
import CommonButton from '../../../components/CommonButton/CommonButton';
import { SCREEN_WIDTH } from '../../../styles/mainStyles';
import { useTheme } from '../../../components/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ARList'>;

export default function CategoryListScreen({ navigation }: Props) {
  const [categoryType, setCategoryType] = useState('local');
  const [radius, setRadius] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState({});
  const { isDark } = useTheme();

  const {
    isLoading,
    isError: err,
    data: allCategories = [],
    error,
  } = useQuery([`allCategories-${categoryType}`, categoryType], () =>
    getAllCategories(categoryType),
  );

  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleSubmit = () => {
    navigation.navigate('ARMerchants', {
      categoryId: selectedCategory?.categoryId,
      categoryName: selectedCategory?.categoryName,
      radius,
    } as any);
  };

  const toggleSection = (k: 'local' | 'global') => {
    if (isLoading) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setCategoryType(k);
  };

  if (err) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{t('ar.loadingError')}</Text>
        <Text style={styles.hint}>{err}</Text>
      </View>
    );
  }
  if (!allCategories.length && !isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>{t('ar.noCategoriesFound')}</Text>
      </View>
    );
  }

  const Chevron = ({ open }: { open: boolean }) => (
    <Text
      style={[
        styles.chevron,
        { color: labelColor },
        open && { transform: [{ rotate: '90deg' }] },
      ]}
    >
      ›
    </Text>
  );

  const labelColor = isDark ? '#FFB000' : colors.darkBlue;

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Header
        btns={['back']}
        additionalBtnsProps={{
          back: {
            btnColor: isDark ? colors.white : undefined,
          },
        }}
      />

      <View style={styles.radiusWrapper}>
        <Text style={[styles.labelText, { color: labelColor }]}>
          {t('ar.radiusLabel')}
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={50}
          step={1}
          onValueChange={setRadius}
          minimumTrackTintColor={'#838383'}
          value={radius}
        />
        <Text
          style={[styles.radiusText, { color: isDark ? '#fff' : '#000' }]}
          numberOfLines={1}
        >
          {`${radius} km`}
        </Text>
      </View>

      <View style={{ marginVertical: 20, marginHorizontal: 6 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleSection('local')}
          style={styles.sectionHeaderWrap}
        >
          <View style={styles.sectionHeaderRow}>
            <Chevron open={categoryType === 'local'} />
            <Text style={[styles.sectionHeader, { color: labelColor }]}>
              {t('MainScreen.localCategories')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleSection('global')}
          style={styles.sectionHeaderWrap}
        >
          <View style={styles.sectionHeaderRow}>
            <Chevron open={categoryType === 'global'} />
            <Text style={[styles.sectionHeader, { color: labelColor }]}>
              {t('MainScreen.globalCategories')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={isLoading ? [] : allCategories}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{
          flexGrow: 1,
          marginHorizontal: 6,
        }}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedCategory?.categoryId;

          return (
            <TouchableOpacity
              style={[
                styles.row,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? colors.mainDarkMode
                      : colors.darkBlue
                    : isDark
                      ? colors.navyBlue
                      : '#fff',
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                if (isSelected) {
                  setSelectedCategory({});
                }

                setSelectedCategory({
                  categoryId: item.id,
                  categoryName: item.name,
                });
              }}
            >
              <Text
                style={[styles.title, { color: isDark ? '#fff' : '#000' }]}
                numberOfLines={1}
              >
                {isAr ? item?.x_name_arabic : item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.hint}>{t('ar.loadingCategories')}</Text>
            </View>
          ) : null
        }
      />

      {
        <CommonButton
          onPress={handleSubmit}
          label={t('General.confirm')}
          loading={isLoading}
          textColor={colors.white}
          style={styles.submitBtn}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  err: { color: '#ff8a80', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  hint: { color: '#ccc', marginBottom: 60 },

  sectionHeaderWrap: {
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  chevron: {
    color: '#FFB000',
    fontSize: 20,
    marginRight: 6,
    transform: [{ rotate: '0deg' }],
  },
  sectionHeader: {
    color: '#FFB000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    flex: 1,
  },
  labelText: {
    color: '#FFB000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  radiusText: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: '800',
  },
  sectionCount: {
    color: '#9ecbff',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,120,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
  },
  title: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  count: {
    color: '#9ecbff',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(0,120,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  sep: { height: 10 },
  sectionSep: { height: 18 },
  radiusWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  submitBtn: {
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
});
