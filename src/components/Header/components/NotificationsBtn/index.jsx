import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TypographyText } from '../../../Typography';
import { LUSAIL_REGULAR } from '../../../../redux/types';
import NotificationSvg from '../../../../assets/notification.svg';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../ThemeProvider';
import { colors } from '../../../colors';
import { useNavigation } from '@react-navigation/native';

const NotificationsBtn = () => {
  const messageNotifications = useSelector(
    state => state.notificationsReducer.messageNotifications,
  );
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const unreadCount =
    messageNotifications?.filter(m => m.state === 'unread')?.length ?? 0;
  const isNotifications = unreadCount > 0;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        navigation.navigate('Notifications');
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={styles.iconWrapper}>
        <NotificationSvg
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
          height={20}
          width={18}
        />
        {isNotifications ? (
          <View style={styles.countWrapper}>
            <TypographyText
              textColor={colors.white}
              size={7}
              font={LUSAIL_REGULAR}
              title={unreadCount}
              style={styles.text}
              numberOfLines={1}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 28,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
  },
  countWrapper: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FA634D',
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationsBtn;
