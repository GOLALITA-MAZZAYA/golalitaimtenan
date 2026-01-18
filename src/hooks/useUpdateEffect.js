import { useEffect, useRef } from "react";

function useUpdateEffect(effect, deps) {
  const useFirstMountState = () => {
    const isFirst = useRef(true);

    if (isFirst.current) {
      isFirst.current = false;
      return true;
    }

    return isFirst.current;
  };

  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
}

export default useUpdateEffect;
