import { useContext, useEffect } from "react";
import PortalContext from "./PortalContext";

const Portal = ({ children, name }) => {
  const { addComponent, removeComponent } = useContext(PortalContext);
  useEffect(() => {
    addComponent({ name, component: children });
    return () => {
      removeComponent(name);
    };
  }, [children, name]);

  return null;
};
export default Portal;
