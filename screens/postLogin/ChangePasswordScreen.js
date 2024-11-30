import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setAuthToken(token);
      } else {
        Alert.alert("Error", "No se encontró el token de autenticación");
        navigation.navigate("Login");
      }
    };

    fetchAuthToken();
  }, [navigation]);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor, complete todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las nuevas contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://uasdapi.ia3x.com/cambiar_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (response.ok && data.success) {
        Alert.alert("Éxito", "Contraseña cambiada exitosamente");
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          data.message || "No se pudo cambiar la contraseña"
        );
      }
    } catch (error) {
      console.error("Error en changePassword:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al intentar cambiar la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back-outline" size={25} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Cambiar Contraseña</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña Actual"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={secureTextEntry}
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={secureTextEntry}
          editable={!loading}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={25} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
            styles.changePasswordButton,
            {
              backgroundColor:
                oldPassword && newPassword && confirmPassword
                  ? "rgba(90, 154, 230, 1)"
                  : "#ccc",
            },
          ]}
          onPress={changePassword}
          disabled={!oldPassword || !newPassword || !confirmPassword || loading}
        >
          <Text style={styles.changePasswordButtonText}>
            Cambiar Contraseña
          </Text>
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
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
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
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  changePasswordButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
