import { useMemo } from "react";
import { MUMAYIZATEMAIL } from "../constants";

const useIsMumayz = (userEmail) => {
  return useMemo(() => {
    if (!userEmail || !MUMAYIZATEMAIL) return false;
    return userEmail.toLowerCase() === MUMAYIZATEMAIL.toLowerCase();
  }, [userEmail, MUMAYIZATEMAIL]);
};

export default useIsMumayz;
