import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PreseleccionScreen() {
  return (
    <View style={styles.container}>
      <Text>Preselección</Text>
      <Text>Aquí puedes preseleccionar tus asignaturas.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
