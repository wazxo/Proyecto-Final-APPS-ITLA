import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HorariosScreen() {
  return (
    <View style={styles.container}>
      <Text>Horarios</Text>
      <Text>Aquí puedes consultar tus horarios de clase.</Text>
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
