import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const login = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://uasdapi.ia3x.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login exitoso:", data);
        // Guardar token y datos del usuario localmente
        await AsyncStorage.setItem("authToken", data.data.authToken);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            nombre: data.data.nombre,
            apellido: data.data.apellido,
            email: data.data.email,
          })
        );
      } else {
        Alert.alert("Error", "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextEntry}
        editable={!loading}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} disabled={loading}>
        <Text style={styles.toggleText}>
          {secureTextEntry ? "Mostrar" : "Ocultar"} Contraseña
        </Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          onPress={login}
          disabled={!username || !password || loading}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  toggleText: {
    color: "#007bff",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007bff",
    marginVertical: 10,
  },
});

export default LoginScreen;
