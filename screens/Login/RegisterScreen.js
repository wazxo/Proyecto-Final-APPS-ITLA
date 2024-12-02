import React, { useState } from "react";
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

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const register = async () => {
    if (!nombre || !apellido || !username || !email || !password) {
      Alert.alert("Error", "Por favor, complete todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://uasdapi.ia3x.com/crear_usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          username: username,
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (response.ok && data.success) {
        Alert.alert("Éxito", "Usuario creado exitosamente");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "No se pudo crear el usuario");
      }
    } catch (error) {
      console.error("Error en register:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar crear el usuario");
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
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
            styles.registerButton,
            {
              backgroundColor:
                nombre && apellido && username && email && password
                  ? "rgba(90, 154, 230, 1)"
                  : "#ccc",
            },
          ]}
          onPress={register}
          disabled={
            !nombre || !apellido || !username || !email || !password || loading
          }
        >
          <Icon
            name="log-in-outline"
            size={20}
            color="white"
            style={styles.registerIcon}
          />
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      >
        <Text style={styles.link}>¿Ya tienes una cuenta? Iniciar Sesión</Text>
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
    backgroundColor: "#f8f9fa",
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
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  registerIcon: {
    marginRight: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
  },
  link: {
    color: "#1E90FF",
    marginBottom: 10,
  },
});

export default RegisterScreen;
