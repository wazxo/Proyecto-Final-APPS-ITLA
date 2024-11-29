import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function NoticiasScreen() {
  return (
    <View style={styles.container}>
      <Text>Noticias</Text>
      <Text>Esta pantalla muestra las noticias recientes de la UASD.</Text>
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
