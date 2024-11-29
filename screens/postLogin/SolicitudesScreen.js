import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function SolicitudesYTareasScreen() {
  return (
    <View style={styles.container}>
      <Text>Solicitudes y Tareas</Text>
      <Text>
        Esta pantalla gestiona solicitudes administrativas y tareas pendientes.
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
