import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Text>
        Esta pantalla muestra la información del usuario y de los
        desarrolladores.
      </Text>
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
