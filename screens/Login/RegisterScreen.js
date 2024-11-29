import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../../assets/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tokenData from "../../config/token.json";

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const readToken = async () => {
    try {
      if (tokenData.authToken) {
        console.log("Token recuperado:", tokenData.authToken);
        await AsyncStorage.setItem("authToken", tokenData.authToken);
        setAuthToken(tokenData.authToken);
      } else {
        console.log("No se encontró un token válido.");
      }
    } catch (error) {
      console.error("Error al leer el archivo token.json:", error);
    }
  };

  useEffect(() => {
    readToken();
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const response = await fetch("https://uasdapi.ia3x.com/crear_usuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: 0, // Puedes ajustar esto según sea necesario
            nombre,
            apellido,
            username,
            password,
            email,
            authToken: token,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Registro exitoso:", data);
          Alert.alert(
            "Éxito",
            "Registro exitoso",
            [
              {
                text: "OK",
                onPress: () => navigation.replace("Login"),
              },
            ],
            { cancelable: false }
          );
        } else {
          console.error("Error en el registro:", data);
          Alert.alert(
            "Error",
            data.message || "Ocurrió un problema al intentar registrarse"
          );
        }
      } else {
        Alert.alert("Error", "No se encontró un token válido");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Crear Cuenta</Text>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          secureTextEntry={secureTextEntry}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={25}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Registrars</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(90, 154, 230, 1)",
    borderRadius: 30,
    width: 200,
    height: 50,
    marginVertical: 10,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  link: {
    color: "#1E90FF",
    marginTop: 10,
  },
});

export default RegisterScreen;
