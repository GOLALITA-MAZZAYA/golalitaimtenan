import { useMemo } from "react";
import { org } from "../org/config";

const useIsMumayz = (userEmail) => {
  return useMemo(() => {
    if (!userEmail || !org.mumayizatEmail) return false;
    return userEmail.toLowerCase() === org.mumayizatEmail.toLowerCase();
  }, [userEmail]);
};

export default useIsMumayz;
