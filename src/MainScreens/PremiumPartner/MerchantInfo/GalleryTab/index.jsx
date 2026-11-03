import { useState } from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../components/AppImage";
import ImageViewerModal from "../TabHeader/ImageViewerModal";
import {SCREEN_WIDTH} from "../../../../styles/mainStyles";
import {colors} from "../../../../components/colors";

const NUM_COLUMNS = 2;

// This grid renders inside the merchant info screen's Tabs.ScrollView, so it
// must not be its own scrollable/virtualized list — a FlatList here nests a
// VirtualizedList inside a same-orientation ScrollView, which RN warns
// breaks windowing (i.e. the virtualization was never actually effective in
// this position anyway). Plain View + map, one row per NUM_COLUMNS images.
const buildRows = (images) => {
    const rows = [];

    for (let i = 0; i < images.length; i += NUM_COLUMNS) {
        rows.push(images.slice(i, i + NUM_COLUMNS));
    }

    return rows;
};

const GalleryTab = ({images}) => {
    const [selectedImage, setSelectedImage] = useState('');
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
                  onPress={() => setSelectedImage({url: item})}
                  style={[styles.imageWrapper,{backgroundColor: colors.loyaltyCardBackground}]}
                >
                   <Image source={{uri: item}} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
       </View>

       <ImageViewerModal
           onClose={() => setSelectedImage('')}
           isVisible={!!selectedImage}
           data={selectedImage ? [selectedImage]: []}
        />
       </>
    );
};

const styles = StyleSheet.create({
    image: {
      width: SCREEN_WIDTH/2 -25,
      height: SCREEN_WIDTH/2 -25,
      borderRadius: 24
    },
    imageWrapper: {
      width: SCREEN_WIDTH/2 -25,
      height: SCREEN_WIDTH/2 -25,
      borderRadius: 24
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    list: {
      marginTop: 20
    }
})

export default GalleryTab;
