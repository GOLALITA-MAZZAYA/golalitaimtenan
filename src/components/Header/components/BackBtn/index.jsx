import { TouchableOpacity } from 'react-native';
import BackSvg from '../../../../assets/back.svg';
import { useTheme } from '../../../ThemeProvider';
import { colors } from '../../../colors';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const BackBtn = props => {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    if (props.onPress) {
      props.onPress();
      return;
    }

    navigation.dispatch(DrawerActions.closeDrawer());
    navigation?.goBack();
  };

  return (
    <TouchableOpacity
      style={{ padding: 11, paddingLeft: 0 }}
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
