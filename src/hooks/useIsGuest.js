import { useSelector } from 'react-redux';

// True while the session belongs to the org's shared guest account (see
// components/ContinueAsGuestBtn). Guest mode hides everything that writes to
// that shared account: favourites, ratings, complaints, profile edits, etc.
const useIsGuest = () => useSelector(state => state.authReducer.isGuest);

export default useIsGuest;
