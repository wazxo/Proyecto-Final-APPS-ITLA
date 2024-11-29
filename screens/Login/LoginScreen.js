import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../../assets/logo.png";

const LoginScreen = ({ navigation }) => {
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

        navigation.replace("DrawerNavigation");
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
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
          textContentType="username"
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          autoComplete="password"
          textContentType="password"
          editable={!loading}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} disabled={loading}>
          <Icon
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={25}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              backgroundColor:
                username && password ? "rgba(90, 154, 230, 1)" : "#ccc",
            },
          ]}
          onPress={login}
          disabled={!username || !password || loading}
        >
          <Icon
            name="log-in-outline"
            size={20}
            color="white"
            style={styles.loginIcon}
          />
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("ResetPassword")}
        disabled={loading}
      >
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateUser")}
        disabled={loading}
      >
        <Text style={styles.link}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginIcon: {
    marginRight: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    color: "#1E90FF",
    marginBottom: 10,
  },
});

export default LoginScreen;
