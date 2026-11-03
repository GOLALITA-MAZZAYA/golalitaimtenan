import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import ListNoData from "../../../components/ListNoData";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { historyConfig } from "..";

const HistoryList = ({ type }) => {
  const config = historyConfig[type];

  const { isLoading, data, refetch } = useQuery(
    ['history', type],
    config.query
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderItem = useCallback(({ item }) => {
    const CardComponent = config.Card;

    const onPress = () => {
        config.onPress(item.booking_reference || item.reference, item)
    };

    const extraProps = config.getCardProps
      ? config.getCardProps(item)
      : { item };


    return (
      <CardComponent
        {...extraProps}
        item={item}
        onPress={onPress}
        style={{ marginBottom: 16 }}
      />
    );
  }, [type]);

  console.log(data, 'data')

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item, index) => String(item.booking_reference || item.reference || index)}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      renderItem={renderItem}
      ListEmptyComponent={
        !isLoading ? <ListNoData style={styles.loader} /> : <FullScreenLoader style={styles.loader} />
      }
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160,
    justifyContent: 'flex-start'
  },
  loader: {
    marginBottom: 160
  }
});


export default HistoryList;