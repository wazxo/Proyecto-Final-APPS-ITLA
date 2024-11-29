import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const PerfilScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null); // Estado para el token

  // Usamos useFocusEffect para cargar datos cuando la pantalla obtiene el foco
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          // Obtener los datos del usuario desde AsyncStorage
          const storedUserData = await AsyncStorage.getItem("userData");
          const storedToken = await AsyncStorage.getItem("authToken");

          if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
          } else {
            Alert.alert("Error", "No se encontró información del usuario");
            navigation.navigate("Iniciar sesión");
          }

          if (storedToken) {
            setAuthToken(storedToken); // Guardar el token en el estado
          } else {
            Alert.alert("Error", "No se encontró el token de autenticación");
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          Alert.alert("Error", "Ocurrió un problema al cargar los datos");
        }
      };

      fetchUserData();
    }, [navigation])
  );

  const removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Item with key ${key} removed successfully`);
      return true;
    } catch (exception) {
      console.error(`Error removing item with key ${key}:`, exception);
      return false;
    }
  };

  const logout = async () => {
    const tokenRemoved = await removeItemValue("authToken");
    const userDataRemoved = await removeItemValue("userData");

    if (tokenRemoved && userDataRemoved) {
      navigation.navigate("Login");
    } else {
      Alert.alert("Error", "No se pudo cerrar sesión correctamente");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.title}>Bienvenido, {userData.nombre}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>
              {userData.nombre} {userData.apellido}
            </Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
            <Text style={styles.label}>Token:</Text>
            <Text style={styles.value}>{authToken}</Text>
          </View>

          <Button title="Cerrar sesión" onPress={logout} color="#FF5C5C" />
        </>
      ) : (
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
    wordWrap: "break-word",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default PerfilScreen;
