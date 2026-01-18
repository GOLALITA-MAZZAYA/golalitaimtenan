// src/MainScreens/MapPage/MapPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import Map from './Map';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import useMerchants from './hooks/useMerchants';
import MainLayout from '../../components/MainLayout';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import MyLocationBtn from './components/MyLocationBtn';
import FiltersModal from './components/FiltersModal';
import MapLoader from './components/MapLoader';
import MerchantModal from './components/MerchantModal';
import { useRoute } from '@react-navigation/native';

const MapPage = () => {
  const { t } = useTranslation();
  const mapRef = useRef();
  const [filters, setFilters] = useState({});
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const route = useRoute();

  const { isLoading, isError, data, error } = useMerchants(
    filters?.location?.latitude,
    filters?.location?.longitude,
  );

  // список мерчантов из API
  const merchants = isLoading ? [] : data || [];

  const moveMapToPosition = (latitude, longitude) => {
    setFilters({
      location: {
        latitude,
        longitude,
      },
    });

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleMarkerPress = e => {
    const merchantId = e.nativeEvent.id;

    const newSelectedMerchant = merchants.find(
      item => +item.merchant_id === +merchantId,
    );

    if (+merchantId !== +selectedMerchant?.merchant_id) {
      setSelectedMerchant(newSelectedMerchant);
    }
  };

  const moveMapToMerchantByName = () => {
    const searchedMerchant = merchants.find(
      item => item.merchant_name === filters.merchant,
    );

    if (searchedMerchant) {
      const latitude = searchedMerchant.partner_latitude;
      const longitude = searchedMerchant.partner_longitude;

      if (latitude && longitude) {
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });

        setSelectedMerchant(searchedMerchant);
      }
    }
  };

  const moveMapToLocation = (latitude, longitude) => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  };

  // переход с параметром merchantId (из пуша или другого экрана)
  useEffect(() => {
    const merchantIdFromParams = route.params?.merchantId;

    if (!merchantIdFromParams || !merchants.length) return;

    const merchant = merchants.find(
      item => +item.merchant_id === +merchantIdFromParams,
    );

    if (!merchant) return;

    setSelectedMerchant(merchant);

    const latitude = Number(merchant.partner_latitude);
    const longitude = Number(merchant.partner_longitude);

    if (latitude && longitude) {
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [route.params?.merchantId, merchants.length]);

  // поиск мерчанта по имени или по локации фильтров
  useEffect(() => {
    if (filters?.merchant) {
      moveMapToMerchantByName();
      return;
    }

    if (filters?.location) {
      const { latitude, longitude } = filters.location;
      moveMapToLocation(latitude, longitude);
    }
  }, [merchants.length, filters?.merchant, filters?.location?.id]);

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<Header label={t('Drawer.map')} btns={['back']} />}
      headerHeight={50}
      contentStyle={{ height: SCREEN_HEIGHT - 120 }}
    >
      {isLoading && <MapLoader />}

      <Map
        merchants={merchants}
        mapRef={mapRef}
        onMarkerPress={handleMarkerPress}
      />

      <MyLocationBtn moveMapToPosition={moveMapToPosition} />

      <FiltersModal onGetFilters={setFilters} filters={filters} />

      <MerchantModal
        merchant={selectedMerchant}
        setSelectedMerchant={setSelectedMerchant}
      />
    </MainLayout>
  );
};

export default MapPage;
