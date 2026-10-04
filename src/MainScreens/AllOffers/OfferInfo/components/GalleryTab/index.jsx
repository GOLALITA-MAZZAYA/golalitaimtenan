import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ImageViewerModal from "../ImageViewerModal";
import { SCREEN_WIDTH } from "../../../../../styles/mainStyles";
import { colors } from "../../../../../components/colors";
import { useTheme } from "../../../../../components/ThemeProvider";

const NUM_COLUMNS = 2;

const buildRows = (images) => {
  const rows = [];
  for (let i = 0; i < images.length; i += NUM_COLUMNS) {
    rows.push(images.slice(i, i + NUM_COLUMNS));
  }
  return rows;
};

const GalleryTab = ({ images }) => {
  const { isDark } = useTheme();
  const [selectedImage, setSelectedImage] = useState("");
  const rows = buildRows(images || []);

  return (
    <>
      <View style={styles.list}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.row,
              { marginBottom: rowIndex === rows.length - 1 ? 4 : 19 },
            ]}
          >
            {row.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                onPress={() => setSelectedImage({ url: item })}
                style={[
                  styles.imageWrapper,
                  {
                    backgroundColor: isDark ? "#1C1C1E" : colors.highlatedGrey,
                  },
                ]}
              >
                <Image source={{ uri: item }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <ImageViewerModal
        onClose={() => setSelectedImage("")}
        isVisible={!!selectedImage}
        data={selectedImage ? [selectedImage] : []}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH / 2 - 25,
    height: SCREEN_WIDTH / 2 - 25,
    borderRadius: 24,
  },
  imageWrapper: {
    width: SCREEN_WIDTH / 2 - 25,
    height: SCREEN_WIDTH / 2 - 25,
    borderRadius: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    marginTop: 20,
  },
});

export default GalleryTab;
