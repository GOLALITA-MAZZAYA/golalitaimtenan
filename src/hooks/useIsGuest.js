import { useSelector } from "react-redux";

const useIsGuest = () => {
  const isMainUser = useSelector((state) => state.authReducer.isGuest);

  return isMainUser;
};

export default useIsGuest;
