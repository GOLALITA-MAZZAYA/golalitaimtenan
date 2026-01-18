// src/components/AR/screens/ARMapScreen.tsx
import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import type { Merchant, RootStackParamList } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { startFOP, type FOPEvent } from '../fusedOrientation';
import { useTranslation } from 'react-i18next';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CompassHeading from 'react-native-compass-heading';

import { getMerchantsByCoordinates } from '../../../api/merchants';
import MerchantModal from '../../MapPage/components/MerchantModal';
import Header from '../../../components/Header';
import { SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { colors } from '../../../components/colors';
import Distance from '../../../components/Distance';
import { TypographyText } from '../../../components/Typography';

/** ================= DEBUG ================= */
const DEBUG_MODAL = true;
const D = (...args: any[]) =>
  DEBUG_MODAL && console.log('[AR][MODAL]', ...args);

/** ---------- ассеты ---------- */
const Vector = require('../img/Vector.png');
const ComponentIcon = require('../img/Component.png');

/** ---------- размеры/константы ---------- */
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_H * 0.2;
const FOV = 180;

const CARD_W = 320;
const CARD_H = 64;
const CARD_TOP = 125;
const CARD_PADDING_EDGE = 60;
const SPAN = Math.max(0, SCREEN_W / 2 - CARD_PADDING_EDGE - CARD_W / 2);

const CARD_MIN_GAP = 5;
const LANE_STEP = CARD_H + 5;

const GEO_POLL_MS = 60_000;

/** ---------- утилы ---------- */
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
const normDeg = (a: number) => {
  let x = a % 360;
  if (x < 0) x += 360;
  return x;
};
const shortestDelta = (from: number, to: number) => {
  let d = normDeg(to) - normDeg(from);
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
};
type LatLng = { latitude: number; longitude: number };

const stdCos = (v: number) => Math.cos(v);
const bearingBetween = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * stdCos(toRad(lat2));
  const x =
    stdCos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * stdCos(toRad(lat2)) * Math.cos(dLon);
  return normDeg(toDeg(Math.atan2(y, x)));
};

const curveOffset = (rel: number) => 14 * (Math.abs(rel) / (FOV / 2));

/** ---------- стрелка ---------- */
const ArrowIcon = ({
  size = 34,
  fill = '#FFB000',
  stroke = '#202020',
}: {
  size?: number;
  fill?: string;
  stroke?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      d="M24 6 L39 34 L30 31 L24 42 L18 31 L9 34 Z"
      fill="#000"
      opacity={0.22}
    />
    <Path
      d="M24 4 L40 34 L30 30 L24 42 L18 30 L8 34 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

const FilterIcon = ({
  size = 20,
  color = '#fff',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .39.812L10 7.093V13.5a.5.5 0 0 1-.757.429l-2-1.2A.5.5 0 0 1 7 12.3V7.093L1.108 1.312A.5.5 0 0 1 1.5 1.5z"
      fill={color}
    />
  </Svg>
);

/** ---------- тип для модалки + адаптер ---------- */
type ModalMerchant = {
  merchant_id: number;
  merchant_logo?: string | null;
  merchant_name: string;
  x_arabic_name?: string | null;
  category_id?: number | null;
  isOrganization?: boolean | null;
  partner_latitude?: number | null;
  partner_longitude?: number | null;
  [k: string]: any;
};

const hasCoords = (
  m: Merchant,
): m is Merchant & { partner_latitude: number; partner_longitude: number } =>
  typeof m.partner_latitude === 'number' &&
  typeof m.partner_longitude === 'number' &&
  !Number.isNaN(m.partner_latitude) &&
  !Number.isNaN(m.partner_longitude);

/** ============================================================
 *  МИНИ-КАРТА
 *  ============================================================ */
type MiniMapProps = {
  coords: LatLng;
  nearest5: Merchant[];
  headingRotate: RNAnimated.AnimatedInterpolation<string | number>;
};

const MiniMap = memo(function MiniMap({
  coords,
  nearest5,
  headingRotate,
}: MiniMapProps) {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (mapRef.current && coords) {
      mapRef.current.animateCamera(
        { center: coords, zoom: 16, heading: 0, pitch: 0 },
        { duration: 400 },
      );
    }
  }, [coords]);

  return (
    <View style={styles.mapBox}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsCompass={false}
        showsMyLocationButton={false}
        showsUserLocation={false}
      >
        {nearest5.filter(hasCoords).map(m => (
          <Marker
            key={m.merchant_id}
            coordinate={{
              latitude: m.partner_latitude,
              longitude: m.partner_longitude,
            }}
            title={m.merchant_name}
            description={m.category_name ?? undefined}
            zIndex={2}
            tracksViewChanges={false}
          />
        ))}

        {/* Точка пользователя */}
        <Marker
          coordinate={coords}
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={5}
          tracksViewChanges={false}
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#1E88E5',
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        </Marker>

        {/* Стрелка курса — платф. поведение */}
        <Marker
          coordinate={coords}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          zIndex={6}
          tracksViewChanges={true}
        >
          <RNAnimated.View
            collapsable={false}
            renderToHardwareTextureAndroid
            style={{ transform: [{ rotate: headingRotate }] }}
          >
            <ArrowIcon />
          </RNAnimated.View>
        </Marker>
      </MapView>
    </View>
  );
});

/** ============================================================
 *  ЭКРАН
 *  ============================================================ */
export default function ARMapScreen({ route }: any) {
  const categoryId: number | undefined | null = route?.params?.categoryId;
  const radius: number | undefined | null = route?.params?.radius;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();

  // Камера
  const isFocused = useIsFocused();
  const device = useCameraDevice('back');
  const { hasPermission: hasCamPerm, requestPermission: requestCamPerm } =
    useCameraPermission();

  // Гео/данные
  const [locOk, setLocOk] = useState(false);
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  /** ---------- heading анимация ---------- */
  const headingDegCont = useRef(0);
  const headingAnim = useRef(new RNAnimated.Value(0)).current;
  const lastAnimatedRef = useRef(0);
  const animBusyRef = useRef(false);
  const animTargetRef = useRef(0);

  const lastCompassTs = useRef(0);
  const [headingTick, setHeadingTick] = useState(0);

  const permAskedRef = useRef(false);
  const geoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isArabic = i18n.language === 'ar';

  /** ---------- выбранный мерчант ---------- */
  const [selectedMerchant, setSelectedMerchant] =
    useState<ModalMerchant | null>(null);

  /** permissions */
  useEffect(() => {
    (async () => {
      if (!hasCamPerm) {
        await requestCamPerm();
      }
      if (!permAskedRef.current) {
        permAskedRef.current = true;

        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          setLocOk(granted === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          setLocOk(auth === 'granted');

          try {
            const st = await check(PERMISSIONS.IOS.MOTION);
            if (st !== RESULTS.GRANTED) await request(PERMISSIONS.IOS.MOTION);
          } catch {
            /* ignore */
          }
        }
      }
    })();
  }, [hasCamPerm, requestCamPerm]);

  /** платф. тайминг (Android побыстрее) */
  const durationForDelta = (deltaAbs: number) => {
    const base = Math.max(40, Math.min(160, Math.round(deltaAbs * 5)));
    return Platform.OS === 'android' ? Math.max(30, base - 20) : base;
  };

  const headingRotate = headingAnim.interpolate({
    inputRange: [-7200, 7200],
    outputRange: ['-7200deg', '7200deg'],
    extrapolate: 'extend',
  });

  const SMOOTHING_IOS = 0.6;
  const SMOOTHING_ANDROID = 0.25;
  const getSmoothing = () =>
    Platform.OS === 'ios' ? SMOOTHING_IOS : SMOOTHING_ANDROID;

  const getMerchants = async () => {
    try {
      setMerchantsLoading(true);
      const data = await getMerchantsByCoordinates(
        coords?.latitude,
        coords?.longitude,
        categoryId,
        radius,
      );

      console.log(data, 'new merchants');

      setMerchants(data);
    } catch (err) {
      console.log(err, 'get merchants error');
    } finally {
      setMerchantsLoading(false);
    }
  };

  useEffect(() => {
    if (coords?.latitude && coords.longitude) {
      getMerchants();
    }
  }, [coords?.latitude, coords?.longitude, categoryId, radius]);

  /** UI тикер */
  useEffect(() => {
    if (!isFocused) return;
    const iv = setInterval(() => {
      setHeadingTick(x => (x + 1) & 0xffff);
    }, 20);
    return () => clearInterval(iv);
  }, [isFocused]);

  /** компас: fusedOrientation + iOS fallback */
  useFocusEffect(
    React.useCallback(() => {
      animBusyRef.current = false;

      // выровнять анимацию к накопленному heading
      headingAnim.stopAnimation(v => {
        lastAnimatedRef.current =
          typeof v === 'number' ? v : lastAnimatedRef.current;
        animTargetRef.current = headingDegCont.current;
        RNAnimated.timing(headingAnim, {
          toValue: animTargetRef.current,
          duration: 60,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          lastAnimatedRef.current = animTargetRef.current;
        });
      });

      const smoothing = getSmoothing();

      // 1) основной источник
      const fopSub = startFOP((evt: FOPEvent) => {
        const raw = normDeg(evt.heading);
        const prev = headingDegCont.current;
        const next = prev + shortestDelta(normDeg(prev), raw) * smoothing;
        headingDegCont.current = next;
        animTargetRef.current = next;

        if (!animBusyRef.current) {
          const from = lastAnimatedRef.current,
            to = animTargetRef.current;
          const delta = Math.abs(to - from);
          RNAnimated.timing(headingAnim, {
            toValue: to,
            duration: durationForDelta(delta),
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(({ finished }) => {
            animBusyRef.current = false;
            if (finished) lastAnimatedRef.current = to;
          });
          animBusyRef.current = true;
        }
        lastCompassTs.current = Date.now();
      }, 100);

      // 2) iOS fallback через CoreLocation heading
      let iosCompassRunning = false;
      const startIosFallback = () => {
        if (Platform.OS !== 'ios' || iosCompassRunning) return;
        try {
          CompassHeading.start(1, ({ heading }: { heading: number }) => {
            const raw = normDeg(heading);
            const prev = headingDegCont.current;
            const next = prev + shortestDelta(normDeg(prev), raw) * smoothing;
            headingDegCont.current = next;
            animTargetRef.current = next;

            if (!animBusyRef.current) {
              const from = lastAnimatedRef.current,
                to = animTargetRef.current;
              const delta = Math.abs(to - from);

              RNAnimated.timing(headingAnim, {
                toValue: to,
                duration: Math.max(40, Math.min(140, Math.round(delta * 4.5))),
                easing: Easing.linear,
                useNativeDriver: true,
              }).start(({ finished }) => {
                animBusyRef.current = false;
                if (finished) lastAnimatedRef.current = to;
              });

              animBusyRef.current = true;
            }
            lastCompassTs.current = Date.now();
          });
          iosCompassRunning = true;
        } catch (e) {
          console.warn('[AR][iOS] Compass fallback start error:', e);
        }
      };

      const fallbackTimer = setTimeout(() => {
        if (Platform.OS === 'ios' && Date.now() - lastCompassTs.current > 500) {
          startIosFallback();
        }
      }, 500);

      return () => {
        try {
          fopSub?.stop?.();
        } catch {}
        clearTimeout(fallbackTimer);
        if (iosCompassRunning) {
          try {
            CompassHeading.stop();
          } catch {}
        }
        animBusyRef.current = false;
      };
    }, [headingAnim]),
  );

  /** гео пулл */
  useEffect(() => {
    if (!locOk || !isFocused) return;

    if (coords) {
      return;
    }

    const getOnce = () =>
      Geolocation.getCurrentPosition(
        (p: GeoPosition) => {
          const next: LatLng = {
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          };

          // setCoords({ latitude: 25.286106, longitude: 51.534817 });
          setCoords(next);

          const course = bearingBetween(
            next.latitude,
            next.longitude,
            next.latitude,
            next.longitude,
          );

          const p0 = headingDegCont.current;
          const factor = Platform.OS === 'ios' ? 0.6 : 0.35;
          const n = p0 + shortestDelta(normDeg(p0), course) * factor;
          headingDegCont.current = n;
          animTargetRef.current = n;

          RNAnimated.timing(headingAnim, {
            toValue: n,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(() => {
            lastAnimatedRef.current = n;
          });
        },
        e => console.warn('[AR] getCurrentPosition error:', e?.message),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
      );

    getOnce();
    geoTimerRef.current = setInterval(getOnce, GEO_POLL_MS);

    return () => {
      if (geoTimerRef.current) clearInterval(geoTimerRef.current);
      Geolocation.stopObserving?.();
    };
  }, [locOk, isFocused, headingAnim]);

  /** ближайшие 5 */
  const nearest5: Merchant[] = useMemo(() => {
    if (!coords) return [];

    const withDist = merchants.filter(hasCoords).map(m => ({
      m,
      d: '',
    }));

    return withDist.slice(0, 5).map(x => x.m);
  }, [coords?.latitude, coords?.longitude, merchants?.length]);

  const getRaw = () => {
    if (!merchants?.length) {
      return [];
    }

    const OFFSCREEN = CARD_W;

    const items = nearest5
      .filter(hasCoords)
      .map(m => {
        const brg = bearingBetween(
          coords.latitude,
          coords.longitude,
          m.partner_latitude,
          m.partner_longitude,
        );
        const rel = ((brg - normDeg(headingDegCont.current) + 540) % 360) - 180;
        const inFov = Math.abs(rel) <= FOV / 2;
        const x = (rel / (FOV / 2)) * (SPAN + OFFSCREEN);
        return { m, rel, inFov, x };
      })
      .sort((a, b) => a.x - b.x);

    return items;
  };

  /** карточки — позиционирование */
  const raw = useMemo(getRaw, [
    nearest5,
    coords?.latitude,
    coords?.longitude,
    headingTick,
  ]);

  const deviceReady = device != null && hasCamPerm;

  return (
    <View style={styles.root}>
      <Header
        btns={['back']}
        additionalBtnsProps={{
          back: {
            btnColor: colors.white,
            onPress: () => navigation.navigate('Main'),
          },
        }}
      />

      <TouchableOpacity
        style={styles.listBtn}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ARCategories')}
      >
        <FilterIcon size={20} color="#FFB000" />
      </TouchableOpacity>

      {/* Камера фоном */}
      {deviceReady ? (
        <Camera
          style={styles.fill}
          device={device!}
          isActive={isFocused}
          photo={false}
          video={false}
          audio={false}
        />
      ) : (
        <View style={styles.fill} />
      )}

      {!deviceReady ||
        (merchantsLoading && (
          <View style={styles.center}>
            <Text style={styles.loadingText}>{t('General.loading')}</Text>
          </View>
        ))}

      {deviceReady && !locOk && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('General.noGeolocation')}</Text>
        </View>
      )}

      {deviceReady && locOk && !coords && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('General.loading')}</Text>
        </View>
      )}

      {deviceReady && locOk && coords && !merchantsLoading && !raw?.length && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('ar.noMerchantsFound')}</Text>
        </View>
      )}

      {/* Карточки */}
      {deviceReady &&
        locOk &&
        coords &&
        raw.map(({ m, rel, x, inFov }) => {
          const top =
            CARD_TOP +
            laneIndexFor(m.merchant_id, raw) * LANE_STEP -
            curveOffset(rel);

          const absRel = Math.abs(rel);

          let opacity = 1;
          if (!inFov) opacity = absRel <= 150 ? 1 - (absRel - 90) / 60 : 0;

          return (
            <View
              key={m.merchant_id}
              style={[
                styles.cardWrap,
                { top, opacity, transform: [{ translateX: x }] },
              ]}
              pointerEvents={opacity > 0.25 ? 'auto' : 'none'}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedMerchant(m)}
              >
                <View style={styles.card}>
                  <Image
                    source={ComponentIcon}
                    style={styles.leftIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.textCol}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {isArabic ? m.x_arabic_name : m.merchant_name}
                    </Text>
                    <View style={styles.categoryWrapper}>
                      <TypographyText
                        style={styles.cardSub}
                        numberOfLines={1}
                        title={`${`${isArabic ? m.category_arabic : m.category}` || '—'}`}
                      />
                      <Distance
                        latitude={m.partner_latitude}
                        longitude={m.partner_longitude}
                        textStyle={{
                          color: 'white',
                          fontSize: 12,
                          marginLeft: 8,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Image
                      source={Vector}
                      style={styles.rightIcon}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

      {coords && (
        <MiniMap
          coords={coords}
          nearest5={nearest5}
          headingRotate={headingRotate}
        />
      )}

      {/* Нижняя шторка */}
      <MerchantModal
        merchant={selectedMerchant}
        setSelectedMerchant={setSelectedMerchant}
      />
    </View>
  );
}

/** раскладка по «дорожкам» */
function laneIndexFor(id: number, items: { m: Merchant; x: number }[]) {
  const lanes: { lastX: number }[] = [];
  const minDist = CARD_W + CARD_MIN_GAP;

  for (const it of items) {
    let placed = false;
    for (let li = 0; li < lanes.length; li++) {
      if (it.x - lanes[li].lastX >= minDist) {
        if (it.m.merchant_id === id) return li;
        lanes[li].lastX = it.x;
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push({ lastX: it.x });
      if (it.m.merchant_id === id) return lanes.length - 1;
    }
  }
  return 0;
}

/** ---------- стили ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  fill: { width: '100%', height: '100%' },
  center: {
    position: 'absolute',
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listBtn: {
    position: 'absolute',
    top: Platform.select({ ios: 58, android: 66 }) as number,
    right: 16,
    zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  mapBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MAP_HEIGHT,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  cardWrap: {
    position: 'absolute',
    zIndex: 10,
    left: SCREEN_W / 2 - CARD_W / 2,
  },

  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: 'rgba(0,0,0,0.78)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },

  leftIcon: { width: 28, height: 28, marginLeft: 2 },
  textCol: {
    flex: 1,
    marginHorizontal: 10,
    minWidth: 150,
  },
  cardTitle: {
    flexDirection: 'row',
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  cardSub: {
    color: '#D9D9D9',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 1,
    marginHorizontal: 10,
  },
  rightIcon: { width: 20, height: 20, marginRight: 4 },

  loadingText: {
    color: '#fff',
    marginBottom: 250,
    textAlign: 'center',
  },
  categoryWrapper: {
    flexDirection: 'row',
    minHeight: 30,
    alignItems: 'center',
  },
});
