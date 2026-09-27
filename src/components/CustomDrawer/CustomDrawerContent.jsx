import React from 'react';
import { StyleSheet } from 'react-native';
import CustomDrawer from './CustomDrawer';
import { colors } from '../colors';

/**
 * Resolve the focused MainStack route name from Drawer state.
 * Tree: Drawer(Home) → MainStack → [optional nested stack]
 */
const getFocusedMainStackRouteName = state => {
  const drawerRoute = state?.routes?.[state.index];
  const mainStackState = drawerRoute?.state;

  if (!mainStackState?.routes?.length) {
    return 'Main';
  }

  const stackRoute =
    mainStackState.routes[
      mainStackState.index ?? mainStackState.routes.length - 1
    ];

  let current = stackRoute;
  while (current?.state?.routes?.length) {
    const nested = current.state;
    current = nested.routes[nested.index ?? nested.routes.length - 1];
  }

  return current?.name ?? stackRoute?.name ?? 'Main';
};

const CustomDrawerContent = ({ state }) => {
  const routeName = getFocusedMainStackRouteName(state);

  return <CustomDrawer routeName={routeName} styles={styles} />;
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawer: {
    paddingRight: 10,
    flex: 1,
  },
  close: {},

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  bottom: {
    marginBottom: 30,
  },
  imgWrapper: {
    position: 'relative',
    marginRight: 11,
    padding: 1,
    backgroundColor: colors.white,
    borderRadius: 50,
  },
  premiumIcon: {
    position: 'absolute',
    top: -5,
    left: 0,
  },
  img: {
    width: 44,
    height: 44,
    borderRadius: 50,
  },
  lang: {
    width: 34,
    height: 26,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#fff',
  },
  iconWrapper: {
    marginRight: 0,
    width: 25,
  },
});
