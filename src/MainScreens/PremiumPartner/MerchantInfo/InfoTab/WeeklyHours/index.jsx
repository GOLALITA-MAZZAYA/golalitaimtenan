import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getMerchantWeeklyTimetable } from '../../../../../api/merchants';
import { useTheme } from '../../../../../components/ThemeProvider';
import { TypographyText } from '../../../../../components/Typography';
import { colors } from '../../../../../components/colors';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../../../../redux/types';
import { isRTL } from '../../../../../../utils';
import { sized } from '../../../../../Svg';
import InstructionSvg from '../../../../../assets/loyaltyPoints/instruction.svg';
import ArrowDownSvg from '../../../../../assets/arrow_down_thin.svg';

const TimeIcon = sized(InstructionSvg, 18, 18);

const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MAX_UPCOMING_HOLIDAYS = 3;

const toIsoDate = date => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

// Date (YYYY-MM-DD) of each weekday in the current Sunday–Saturday week.
const getCurrentWeekDates = () => {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return WEEK_DAYS.reduce((acc, dayName, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    acc[dayName] = toIsoDate(date);
    return acc;
  }, {});
};

const WEEK_DAYS_AR = {
  Sunday: 'الأحد',
  Monday: 'الاثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
  Saturday: 'السبت',
};

// "09:00 AM", "12 PM", "11:30 pm" or 24h "14:30" -> minutes since midnight.
const toMinutes = value => {
  const match = `${value ?? ''}`.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (!match) {
    return null;
  }
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();
  if (!meridiem) {
    hours = Number(match[1]);
  } else if (meridiem === 'PM') {
    hours += 12;
  }
  return hours * 60 + minutes;
};

// { open, close } in minutes; close past midnight is pushed to the next day.
const getRange = day => {
  if (day.closed) {
    return null;
  }
  const open = toMinutes(day.open_time);
  let close = toMinutes(day.close_time);
  if (open === null || close === null) {
    return null;
  }
  if (close <= open) {
    close += 24 * 60; // overnight, or 12 AM - 12 AM = 24 hours
  }
  return { open, close };
};

// `onLoaded(true)` tells the parent to hide the legacy open_from/open_till row.
// If the timetable API fails or has no hours on any day, `onLoaded(false)` makes
// the parent show that legacy row instead.
const WeeklyHours = ({ merchantId, isLast, onLoaded }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const [timetable, setTimetable] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!merchantId) {
      console.log('[Timetable] skipped: no merchantId');
      setLoaded(true);
      return;
    }

    let cancelled = false;

    getMerchantWeeklyTimetable(merchantId)
      .then(data => {
        if (cancelled) {
          return;
        }
        console.log(
          '[Timetable] merchant',
          merchantId,
          data?.timetable?.map(d => `${d.day}: ${d.open_time ?? '-'} - ${d.close_time ?? '-'}${d.is_weekend ? ' (weekend)' : ''}`),
        );
        setTimetable(data);
      })
      .catch(err => {
        console.log(
          '[Timetable] Weekly timetable error for merchant',
          merchantId,
          '-> showing legacy open_from/open_till row:',
          err?.message,
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [merchantId]);

  const { rows, status, upcomingHolidays, hasAnyHours } = useMemo(() => {
    const now = new Date();
    const todayIndex = now.getDay();
    const todayName = WEEK_DAYS[todayIndex];
    const todayIso = toIsoDate(now);
    const weekDates = getCurrentWeekDates();
    const holidays = Array.isArray(timetable?.holidays) ? timetable.holidays : [];
    const holidayByDate = holidays.reduce((acc, h) => {
      acc[h.date] = h;
      return acc;
    }, {});
    const apiDays = Array.isArray(timetable?.timetable) ? timetable.timetable : [];

    const byName = WEEK_DAYS.map(dayName => {
      const apiDay = apiDays.find(d => d.day === dayName) || {};
      const holiday = holidayByDate[weekDates[dayName]] || null;
      const open_time = apiDay.open_time || null;
      const close_time = apiDay.close_time || null;

      return {
        day: dayName,
        day_ar: apiDay.day_ar || WEEK_DAYS_AR[dayName],
        open_time,
        close_time,
        holiday,
        isToday: dayName === todayName,
        closed: !!apiDay.is_weekend || !!holiday || !open_time || !close_time,
      };
    });

    // Google-style: list starts from today.
    const ordered = [...byName.slice(todayIndex), ...byName.slice(0, todayIndex)];
    const today = byName[todayIndex];
    const yesterday = byName[(todayIndex + 6) % 7];
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const todayRange = getRange(today);
    const yesterdayRange = getRange(yesterday);
    const openFromYesterday =
      !!yesterdayRange && yesterdayRange.close > 24 * 60 && nowMinutes < yesterdayRange.close - 24 * 60;
    const openToday =
      !!todayRange && nowMinutes >= todayRange.open && nowMinutes < todayRange.close;

    let nextStatus;
    if (todayRange && todayRange.close - todayRange.open >= 24 * 60) {
      nextStatus = { isOpen: true, text: t('MerchantFeedback.open24Hours') };
    } else if (openFromYesterday) {
      nextStatus = { isOpen: true, text: t('MerchantFeedback.closesAt', { time: yesterday.close_time }) };
    } else if (openToday) {
      nextStatus = { isOpen: true, text: t('MerchantFeedback.closesAt', { time: today.close_time }) };
    } else if (todayRange && nowMinutes < todayRange.open) {
      nextStatus = { isOpen: false, text: t('MerchantFeedback.opensAt', { time: today.open_time }) };
    } else {
      // Find the next day that opens.
      const nextDay = [1, 2, 3, 4, 5, 6, 7]
        .map(offset => byName[(todayIndex + offset) % 7])
        .find(d => !d.closed);
      const nextDayLabel = nextDay
        ? `${isArabic ? nextDay.day_ar : nextDay.day} ${nextDay.open_time}`
        : '';
      nextStatus = {
        isOpen: false,
        text: today.holiday
          ? `${isArabic ? today.holiday.name_ar || today.holiday.name : today.holiday.name}`
          : nextDay
            ? t('MerchantFeedback.opensAt', { time: nextDayLabel })
            : '',
      };
    }

    return {
      rows: ordered,
      todayRow: today,
      status: nextStatus,
      hasAnyHours: byName.some(d => !d.closed),
      upcomingHolidays: holidays
        .filter(h => h.date >= todayIso)
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .slice(0, MAX_UPCOMING_HOLIDAYS),
    };
  }, [timetable, isArabic, t]);

  useEffect(() => {
    if (loaded) {
      if (!hasAnyHours) {
        console.log(
          `[Timetable] merchant ${merchantId}: timetable API has no hours -> showing legacy open_from/open_till row`,
        );
      }
      onLoaded?.(hasAnyHours);
    }
  }, [loaded, hasAnyHours]);

  if (!loaded || !hasAnyHours) {
    return null;
  }

  const textColor = isDark ? colors.white : '#111827';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const closedColor = '#EF4444';
  const openColor = '#10B981';
  const rowDirection = isArabic ? 'row-reverse' : 'row';
  const textAlign = isArabic ? 'right' : 'left';

  const dayLabel = day => (isArabic ? day.day_ar || day.day : day.day);
  const holidayLabel = holiday =>
    isArabic ? holiday.name_ar || holiday.name : holiday.name;
  const isClosed = day => day.closed;
  const hoursLabel = day =>
    isClosed(day)
      ? t('MerchantFeedback.closed')
      : `${day.open_time} - ${day.close_time}`;

  const ArrowIcon = sized(ArrowDownSvg, 15, 15, mutedColor);
  const isTodayClosed = !status.isOpen;

  return (
    <View
      style={{
        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded(prev => !prev)}
        style={[styles.headerRow, { flexDirection: rowDirection }]}
      >
        <View style={styles.iconBox}>
          <TimeIcon color={iconColor} />
        </View>

        <View
          style={[
            styles.textBox,
            {
              alignItems: isArabic ? 'flex-end' : 'flex-start',
              marginRight: isArabic ? 16 : 0,
              marginLeft: isArabic ? 0 : 16,
            },
          ]}
        >
          <TypographyText
            title={t('ProductPage.workingHours') || 'Working hours'}
            textColor={mutedColor}
            font={BALOO_REGULAR}
            size={12}
            style={styles.label}
          />

          <View
            style={[
              styles.summaryRow,
              { flexDirection: rowDirection, alignItems: 'center' },
            ]}
          >
            {/* Status Indicator Dot */}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isTodayClosed ? closedColor : openColor },
              ]}
            />

            <TypographyText
              title={[
                status.isOpen
                  ? t('MerchantFeedback.openNowStatus')
                  : t('MerchantFeedback.closedNowStatus'),
                status.text,
              ]
                .filter(Boolean)
                .join(' · ')}
              textColor={isTodayClosed ? closedColor : textColor}
              font={BALOO_SEMIBOLD}
              size={15}
              style={styles.value}
            />
          </View>
        </View>

        {/* Smooth Animated Chevron */}
        <View
          style={[
            styles.arrowBox,
            {
              transform: [{ rotate: expanded ? '180deg' : '0deg' }],
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          ]}
        >
          <ArrowIcon />
        </View>
      </TouchableOpacity>

      {/* Expanded 7-Day Schedule Tray */}
      {expanded && (
        <View
          style={[
            styles.expandedTray,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : '#F9FAFB',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          {rows.map(day => {
            const dayClosed = isClosed(day);

            return (
              <View
                key={day.day}
                style={[
                  styles.dayRow,
                  { flexDirection: rowDirection },
                  day.isToday && [
                    styles.todayRow,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 221, 0, 0.1)'
                        : 'rgba(10, 37, 64, 0.05)',
                    },
                  ],
                ]}
              >
                <View
                  style={[
                    styles.dayLabelGroup,
                    {
                      flexDirection: rowDirection,
                      alignItems: 'center',
                    },
                  ]}
                >
                  <TypographyText
                    title={dayLabel(day)}
                    textColor={day.isToday ? textColor : mutedColor}
                    font={day.isToday ? BALOO_SEMIBOLD : BALOO_REGULAR}
                    size={14}
                    style={[{ textAlign }]}
                  />

                  {day.isToday && (
                    <View
                      style={[
                        styles.todayBadge,
                        {
                          backgroundColor: isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue,
                        },
                      ]}
                    >
                      <TypographyText
                        title={t('MerchantFeedback.today')}
                        textColor={isDark ? colors.black : colors.white}
                        font={BALOO_SEMIBOLD}
                        size={10}
                      />
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.dayHours,
                    { alignItems: isArabic ? 'flex-start' : 'flex-end' },
                  ]}
                >
                  <TypographyText
                    title={hoursLabel(day)}
                    textColor={
                      dayClosed
                        ? closedColor
                        : day.isToday
                          ? textColor
                          : mutedColor
                    }
                    font={day.isToday ? BALOO_SEMIBOLD : BALOO_REGULAR}
                    size={14}
                  />

                  {!!day.holiday && (
                    <TypographyText
                      title={holidayLabel(day.holiday)}
                      textColor={closedColor}
                      font={BALOO_REGULAR}
                      size={11}
                    />
                  )}
                </View>
              </View>
            );
          })}

          {/* Upcoming Holidays Card */}
          {upcomingHolidays.length > 0 && (
            <View
              style={[
                styles.holidaysSection,
                {
                  borderTopColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.06)',
                },
              ]}
            >
              <TypographyText
                title={t('MerchantFeedback.upcomingHolidays')}
                textColor={mutedColor}
                font={BALOO_SEMIBOLD}
                size={12}
                style={[styles.holidayHeader, { textAlign }]}
              />

              {upcomingHolidays.map(holiday => (
                <View
                  key={holiday.date}
                  style={[styles.holidayItemRow, { flexDirection: rowDirection }]}
                >
                  <TypographyText
                    title={holidayLabel(holiday)}
                    textColor={textColor}
                    font={BALOO_REGULAR}
                    size={13}
                    style={[styles.dayName, { textAlign }]}
                  />
                  <TypographyText
                    title={`${isArabic ? holiday.day_ar || holiday.day : holiday.day}, ${holiday.date}`}
                    textColor={mutedColor}
                    font={BALOO_REGULAR}
                    size={12}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
    marginBottom: 2,
  },
  summaryRow: {
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  value: {
    lineHeight: 22,
  },
  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Expanded tray
  expandedTray: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  dayRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  todayRow: {
    borderRadius: 8,
  },
  dayLabelGroup: {
    gap: 6,
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  dayName: {
    flex: 1,
  },
  dayHours: {
    flexShrink: 0,
  },
  holidaysSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  holidayHeader: {
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  holidayItemRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});

export default WeeklyHours;
