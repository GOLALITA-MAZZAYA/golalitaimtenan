import React, { useState } from 'react';
import PortalContext from './PortalContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const PortalProvider = ({ children }) => {
  const [components, setComponents] = useState({});
  const addComponent = ({ name, component }) => {
    setComponents(prevComponents => ({
      ...prevComponents,
      [name]: component,
    }));
  };
  const removeComponent = name => {
    setComponents(prevComponents => {
      const newComponents = { ...prevComponents };
      delete newComponents[name];
      return newComponents;
    });
  };
  return (
    <PortalContext.Provider value={{ addComponent, removeComponent }}>
      <GestureHandlerRootView>
        {children}
        {Object.entries(components).map(([name, Component]) => Component)}
      </GestureHandlerRootView>
    </PortalContext.Provider>
  );
};
export default PortalProvider;
