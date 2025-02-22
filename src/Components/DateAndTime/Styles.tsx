import { StyleSheet } from "react-native";
import { colorKeys } from "../../Constants/Colors";

export const styles = StyleSheet.create({
  container: {alignItems: 'flex-end', padding: 20},
  time: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colorKeys.powderWhite,
  },
  date: {fontSize: 20, color: colorKeys.powderWhite, fontWeight: '500'},
});
