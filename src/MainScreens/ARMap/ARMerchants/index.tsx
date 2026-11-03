// src/components/AR/screens/ARMapScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
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
import {
  disableScreenshotProtection,
  enableScreenshotProtection,
} from '../../../utils/screenshotProtection';
import { setSecureWindow } from '../../../utils/windowSecurity';

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
        {/* tracksViewChanges=false: the arrow's content never changes, only
        its rotation (driven by a native RNAnimated.Value with
        useNativeDriver + renderToHardwareTextureAndroid, i.e. a native-layer
        transform, not a content redraw). Leaving this true forced
        react-native-maps to re-snapshot the marker into a new GPU texture on
        every native animation frame indefinitely — 60/sec, exhausting
        texture memory ("Texture can't be extended any further" native
        errors) and the render pressure behind the "Maximum update depth
        exceeded" warnings on this screen. */}
        <Marker
          coordinate={coords}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          zIndex={6}
          tracksViewChanges={false}
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
 *  КАРТОЧКА МЕРЧАНТА
 *  ============================================================ */
type MerchantCardProps = {
  merchant: Merchant;
  top: number;
  opacity: number;
  translateX: number;
  isArabic: boolean;
  onPress: (m: Merchant) => void;
};

const DISTANCE_TEXT_STYLE = { color: 'white', fontSize: 12, marginLeft: 8 };

// Memoized on primitive props (top/opacity/translateX): the layout tick
// recomputes `raw` — and therefore these values — as often as every ~80ms,
// but while heading and merchant data are stable the computed values for a
// given card are usually identical from one tick to the next. Without this,
// every card's full subtree (Image, Text, Distance, etc.) fully
// re-rendered on every tick regardless of whether anything about it
// actually changed.
const MerchantCard = memo(function MerchantCard({
  merchant: m,
  top,
  opacity,
  translateX,
  isArabic,
  onPress,
}: MerchantCardProps) {
  return (
    <View
      style={[
        styles.cardWrap,
        { top, opacity, transform: [{ translateX }] },
      ]}
      pointerEvents={opacity > 0.25 ? 'auto' : 'none'}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(m)}>
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
                title={`${`${isArabic ? m.arabic_category_name : m.category}` || '—'}`}
              />
              <Distance
                latitude={m.partner_latitude}
                longitude={m.partner_longitude}
                textStyle={DISTANCE_TEXT_STYLE}
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
  const coordsRef = useRef<LatLng | null>(null);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  /** ---------- heading анимация ---------- */
  const headingDegCont = useRef(0);
  const headingAnim = useRef(new RNAnimated.Value(0)).current;
  const lastAnimatedRef = useRef(0);
  const animBusyRef = useRef(false);
  const animTargetRef = useRef(0);
  // animBusyRef alone only blocks a new animation while a prior one is
  // still running — as soon as one finishes (as fast as ~30ms), the very
  // next sensor event can immediately start another. On real devices the
  // OS mostly honors the requested 100ms sensor interval so this rarely
  // matters, but the emulator's simulated orientation provider can fire
  // much faster, and starting a new RNAnimated.timing() on the same node
  // that rapidly floods RN's Animated internals with scheduleUpdate calls
  // faster than they can flush — the source of "Maximum update depth
  // exceeded" warnings traced into createAnimatedPropsHook.js. This ref
  // adds an explicit floor on how often a new animation may start.
  const lastAnimStartRef = useRef(0);
  const MIN_ANIM_START_INTERVAL_MS = 50;

  const lastCompassTs = useRef(0);
  const [headingTick, setHeadingTick] = useState(0);

  const permAskedRef = useRef(false);
  const geoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isArabic = i18n.language === 'ar';

  /** ---------- выбранный мерчант ---------- */
  const [selectedMerchant, setSelectedMerchant] =
    useState<ModalMerchant | null>(null);

  // Stable reference so MerchantCard's memo isn't broken by a fresh
  // closure on every render (same reasoning as the headingRotate fix).
  const handleSelectMerchant = useCallback((m: Merchant) => {
    setSelectedMerchant(m as ModalMerchant);
  }, []);

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

  // Memoized: headingAnim.interpolate() returns a new AnimatedInterpolation
  // object on every call. Without memoizing, headingRotate got a fresh
  // reference on every render and was passed straight into MiniMap (a
  // React.memo'd component) — the new reference broke memo's shallow
  // comparison every time, forcing MiniMap (and its native MapView) to
  // re-render on every single parent render. Under the heading ticker's
  // sustained render pressure that cascaded into both the "Maximum update
  // depth exceeded" warning and native map texture-allocation errors.
  const headingRotate = useMemo(
    () =>
      headingAnim.interpolate({
        inputRange: [-7200, 7200],
        outputRange: ['-7200deg', '7200deg'],
        extrapolate: 'extend',
      }),
    [headingAnim],
  );

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

  /** UI тикер — throttled to ~12/sec: marker repositioning doesn't need
   * 60fps precision, and re-rendering the whole screen every single frame
   * was the excessive-update pressure behind intermittent "Maximum update
   * depth exceeded" warnings on this screen. */
  useEffect(() => {
    if (!isFocused) return;
    const TICK_INTERVAL_MS = 80;
    let frameId: number;
    let lastTick = 0;
    const tick = (now: number) => {
      if (now - lastTick >= TICK_INTERVAL_MS) {
        lastTick = now;
        setHeadingTick(x => (x + 1) & 0xffff);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isFocused]);

  /** Allow camera preview on Android (secure window) */
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        setSecureWindow(false);
        disableScreenshotProtection().catch(() => {});
      }

      return () => {
        if (Platform.OS === 'android') {
          setSecureWindow(true);
          enableScreenshotProtection().catch(() => {});
        }
      };
    }, []),
  );

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

        const now = Date.now();
        if (
          !animBusyRef.current &&
          now - lastAnimStartRef.current >= MIN_ANIM_START_INTERVAL_MS
        ) {
          lastAnimStartRef.current = now;
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

            const now = Date.now();
            if (
              !animBusyRef.current &&
              now - lastAnimStartRef.current >= MIN_ANIM_START_INTERVAL_MS
            ) {
              lastAnimStartRef.current = now;
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
        } catch { }
        clearTimeout(fallbackTimer);
        if (iosCompassRunning) {
          try {
            CompassHeading.stop();
          } catch { }
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

    // Minimum lat/lng delta before a refreshed GPS reading counts as
    // "moved" (~5m). setCoords() below only fires past this threshold —
    // GEO_POLL_MS's setInterval keeps calling getOnce() every 60s for as
    // long as the screen is mounted (this effect only runs once, since
    // coords isn't a dependency, by design — that's what lets it survive
    // the first setCoords() without tearing the interval down). Without
    // this guard, every 60s tick called setCoords() with a brand-new
    // object even when the position was unchanged (e.g. standing still, or
    // a static emulator location), which broke MiniMap's React.memo (coords
    // is passed straight through as a prop) and re-fired its own
    // useEffect(() => animateCamera(...), [coords]) for no reason — part of
    // the render pressure behind the "Maximum update depth exceeded"
    // warnings on this screen.
    const MEANINGFUL_MOVE_DEG = 0.00005;

    const getOnce = () =>
      Geolocation.getCurrentPosition(
        (p: GeoPosition) => {
          const next: LatLng = {
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          };

          const prev = coordsRef.current;
          const moved =
            !prev ||
            Math.abs(prev.latitude - next.latitude) > MEANINGFUL_MOVE_DEG ||
            Math.abs(prev.longitude - next.longitude) > MEANINGFUL_MOVE_DEG;

          if (!moved) return;

          coordsRef.current = next;
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

          // Unlike the FOP/iOS-fallback paths, this one never checked or set
          // animBusyRef — it could start a second RNAnimated.timing() on the
          // same headingAnim node while a compass-driven one was still
          // in-flight. Two overlapping animations registered on the same
          // node is exactly the kind of state RN's Animated internals don't
          // handle cleanly (repeated scheduleUpdate churn -> "Maximum
          // update depth exceeded"). stopAnimation() first guarantees a
          // clean handoff, and participating in animBusyRef stops the
          // compass paths from starting their own overlapping one right
          // after.
          headingAnim.stopAnimation();
          animBusyRef.current = true;
          RNAnimated.timing(headingAnim, {
            toValue: n,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(() => {
            animBusyRef.current = false;
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

    // Quantize heading for card layout so sensor noise/hand tremor doesn't
    // shift cards by sub-degree amounts on every 20ms tick — a moving touch
    // target cancels the Android touch responder before onPress fires.
    const headingForLayout = Math.round(normDeg(headingDegCont.current) / 2) * 2;

    const items = nearest5
      .filter(hasCoords)
      .map(m => {
        const brg = bearingBetween(
          coords.latitude,
          coords.longitude,
          m.partner_latitude,
          m.partner_longitude,
        );
        const rel = ((brg - headingForLayout + 540) % 360) - 180;
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

      {merchantsLoading && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('General.loading')}</Text>
        </View>
      )}

      {!locOk && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('General.noGeolocation')}</Text>
        </View>
      )}

      {locOk && !coords && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('General.loading')}</Text>
        </View>
      )}

      {locOk && coords && !merchantsLoading && !raw?.length && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>{t('ar.noMerchantsFound')}</Text>
        </View>
      )}

      {/* Карточки */}
      {locOk &&
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
            <MerchantCard
              key={m.merchant_id}
              merchant={m}
              top={top}
              opacity={opacity}
              translateX={x}
              isArabic={isArabic}
              onPress={handleSelectMerchant}
            />
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
