import * as React from "react";

const PortalContext = React.createContext({
  addComponent: (element) => {},
  removeComponent: (name) => {},
});
export default PortalContext;
