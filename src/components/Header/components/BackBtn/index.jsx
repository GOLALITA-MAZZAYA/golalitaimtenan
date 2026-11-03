import { TouchableOpacity } from 'react-native';
import BackSvg from '../../../../assets/back.svg';
import { useTheme } from '../../../ThemeProvider';
import { colors } from '../../../colors';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const BackBtn = props => {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const hasDrawerAncestor = () => {
    let nav = navigation;
    while (nav) {
      if (nav.getState?.()?.type === 'drawer') {
        return true;
      }
      nav = nav.getParent?.();
    }
    return false;
  };

  const handlePress = () => {
    if (props.onPress) {
      props.onPress();
      return;
    }

    if (hasDrawerAncestor()) {
      navigation.dispatch(DrawerActions.closeDrawer());
    }

    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
      onPress={handlePress}
    >
      <BackSvg
        color={props.btnColor || isDark ? colors.white : '#202226'}
        height={16}
        width={16}
      />
    </TouchableOpacity>
  );
};

export default BackBtn;
