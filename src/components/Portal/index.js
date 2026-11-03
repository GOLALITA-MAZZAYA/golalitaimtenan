import { useContext, useEffect } from "react";
import PortalContext from "./PortalContext";

const Portal = ({ children, name }) => {
  const { addComponent, removeComponent } = useContext(PortalContext);

  // Registered/removed only on mount/unmount of this Portal instance, not
  // on every re-render — children is a new object every render, so
  // including it here would remove+re-add the portaled component (and
  // briefly drop it from the tree) on every unrelated re-render.
  useEffect(() => {
    return () => {
      removeComponent(name);
    };
  }, [name]);

  // Keeps the portaled content in sync without ever removing it first.
  useEffect(() => {
    addComponent({ name, component: children });
  }, [children, name]);

  return null;
};
export default Portal;
