import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"; // Asegúrate de tener esta librería instalada

const BecaScreen = ({ route, navigation }) => {
  const { tipo } = route.params; // Obtener el tipo de solicitud desde los parámetros de navegación
  const [descripcion, setDescripcion] = useState("");

  const crearSolicitud = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Error", "No se encontró el token de autenticación");
      return;
    }

    const solicitud = {
      tipo,
      descripcion,
    };

    fetch("https://uasdapi.ia3x.com/crear_solicitud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(solicitud),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Éxito", "Solicitud creada exitosamente");
          navigation.goBack(); // Volver a la pantalla anterior
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch((error) => {
        console.error("Error al crear la solicitud:", error);
        Alert.alert("Error", "Hubo un problema al crear la solicitud");
      });
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear Solicitud</Text>
      <Text style={styles.label}>Tipo de Solicitud</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={tipo}
        editable={false} // No permitir cambios en el tipo de solicitud
      />
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Describe tu solicitud..."
        multiline={true} // Permitir múltiples líneas
        numberOfLines={6} // Aumentar el tamaño visible
      />
      <TouchableOpacity style={styles.button} onPress={crearSolicitud}>
        <Text style={styles.buttonText}>Crear Solicitud</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center", // Centrar verticalmente
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra en Android
  },
  disabledInput: {
    backgroundColor: "#e9ecef", // Fondo gris claro para inputs no editables
    color: "#6c757d", // Texto gris
  },
  textarea: {
    height: 150, // Aumentar la altura del campo
    textAlignVertical: "top", // Alineación del texto al principio
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // Sombra en Android
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default BecaScreen;
