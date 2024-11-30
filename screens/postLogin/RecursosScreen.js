import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function RecursosScreen() {
  return (
    <View style={styles.container}>
      <Text>Recursos</Text>
      <Text>Esta pantalla muestra eventos próximos y videos educativos.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
