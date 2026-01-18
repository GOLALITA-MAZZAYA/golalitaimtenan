import { useState } from "react";
import { StyleSheet, Image, TouchableOpacity, View, Text } from "react-native";
import ArrowDownSvg from "../../assets/arrow_down_thin.svg";
import NestedListView, { NestedRow } from "react-native-nested-listview";
import { sized } from "../../Svg";
import { TypographyText } from "../Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { useTheme } from "../ThemeProvider";

const CardWithNestedList = (props) => {
  const { style, onItemPress, data, imageUrl, title, item } = props;
  const [isOpened, setIsOpened] = useState(false);
  const { isDark } = useTheme();

  const ArrowDownIcon = sized(
    ArrowDownSvg,
    15,
    15,
    isDark ? "#fff" : "#027DC1"
  );

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => onItemPress(item)}>
        <Image
          style={styles.mainImage}
          source={{
            uri: imageUrl,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsOpened((val) => !val)}
        style={styles.collapseBtn}
      >
        <TypographyText
          textColor={isDark ? "#fff" : "#027DC1"}
          size={14}
          font={BALOO_SEMIBOLD}
          title={title}
          style={{ marginRight: 6 }}
        />

        <ArrowDownIcon style={isOpened ? styles.collapsedIcon : {}} />
      </TouchableOpacity>

      {isOpened && (
        <NestedListView
          data={data}
          renderNode={(node, level, isLastLevel) => {
            return (
              <NestedRow level={level} style={styles.row}>
                <TouchableOpacity onPress={() => onItemPress(node)}>
                  <TypographyText
                    textColor={isDark ? "#fff" : "#027DC1"}
                    size={level === 1 ? 12 : 10}
                    font={BALOO_SEMIBOLD}
                    title={node.title}
                  />
                </TouchableOpacity>

                {level === 1 && !isLastLevel && (
                  <ArrowDownIcon
                    style={node.opened ? styles.collapsedIcon : {}}
                  />
                )}
              </NestedRow>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    width: "100%",
    height: 123,
    borderRadius: 4,
    marginTop: 16,
  },
  collapseBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  collapsedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default CardWithNestedList;
