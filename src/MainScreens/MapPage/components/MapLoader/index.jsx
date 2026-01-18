import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../styles/mainStyles";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { HEADER_HEIGHT } from "../../../../constants";
import { colors } from "../../../../components/colors";

const MapLoader = () => {
  return (
    <FullScreenLoader absolutePosition style={styles.loader} color={"black"} />
  );
};

const styles = StyleSheet.create({
  loader: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 10000,
    paddingBottom: HEADER_HEIGHT + 80,
  },
});

export default MapLoader;
