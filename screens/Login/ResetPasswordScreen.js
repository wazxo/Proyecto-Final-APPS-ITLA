import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../../assets/logo.png";

const ResetPasswordScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");

  const resetPassword = async () => {
    if (!usuario || !email) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("https://uasdapi.ia3x.com/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          email: email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Éxito",
          "Se ha enviado un enlace para restablecer tu contraseña a tu correo."
        );
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Ocurrió un problema.");
      }
    } catch (error) {
      console.error("Error en reset-password:", error);
      Alert.alert("Error", "Ocurrió un problema al enviar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu nombre de usuario y correo electrónico para recibir un enlace
        de restablecimiento.
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoComplete="username"
          textContentType="username"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
        <Icon
          name="send-outline"
          size={20}
          color="white"
          style={styles.resetIcon}
        />
        <Text style={styles.resetButtonText}>Enviar Enlace</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
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
    backgroundColor: "#f8f9fa",
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
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
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(90, 154, 230, 1)",
    borderRadius: 30,
    width: 200,
    height: 50,
    marginVertical: 10,
  },
  resetIcon: {
    marginRight: 10,
  },
  resetButtonText: {
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

export default ResetPasswordScreen;
