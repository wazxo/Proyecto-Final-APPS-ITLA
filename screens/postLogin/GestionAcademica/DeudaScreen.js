import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DeudaScreen() {
  return (
    <View style={styles.container}>
      <Text>Deuda</Text>
      <Text>Aquí puedes consultar tu deuda con la universidad.</Text>
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
