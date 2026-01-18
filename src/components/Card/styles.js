import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../../styles/mainStyles';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    paddingHorizontal: 17,
    paddingVertical: 15,
    width: SCREEN_WIDTH - 40,
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  nameBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cardNoBlock: {
    alignItems: 'flex-end',
    marginBottom: 11,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 6,
  },
  generalText: {
    fontWeight: '600',
  },
  cardNoText: {
    fontWeight: '700',
  },
  name: {
    marginBottom: -40,
  },
  bottomTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default styles;
