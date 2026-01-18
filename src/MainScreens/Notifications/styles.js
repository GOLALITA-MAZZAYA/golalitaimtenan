import { StyleSheet } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import { colors } from "../../components/colors";

const styles = StyleSheet.create({
  notification: {
    flexDirection: "row",
    alignItems: "center",
    ...mainStyles.p20,
    alignItems: "flex-start",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    borderStyle: "solid",
  },
  deleteButton: {
    backgroundColor: colors.darkBlue,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  descriptionWrapper: {
    marginHorizontal: 16,
    flex: 1,
  },
  dateWrapper: {
    width: 70,
  },
  date: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },
});

export default styles;
