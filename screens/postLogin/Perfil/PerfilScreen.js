import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const PerfilScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Callbacks para el BottomSheet
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
    setIsBottomSheetOpen(index !== -1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
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
            setAuthToken(storedToken);
          } else {
            Alert.alert("Error", "No se encontró el token de autenticación");
          }
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
          Alert.alert("Error", "Ocurrió un problema al cargar los datos");
        } finally {
          setLoading(false); // Deja de cargar una vez que la data esté obtenida
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

  const renderContent = useMemo(
    () => (
      <BottomSheetView style={styles.bottomSheetContent}>
        <TouchableOpacity
          style={styles.bottomSheetButton}
          onPress={() => {
            bottomSheetRef.current?.close();
            navigation.navigate("ChangePassword");
          }}
        >
          <Ionicons name="key" size={20} color="#fff" />
          <Text style={styles.bottomSheetButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomSheetButton} onPress={logout}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.bottomSheetButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomSheetCloseButton}
          onPress={() => bottomSheetRef.current?.close()}
        >
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={styles.bottomSheetCloseButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </BottomSheetView>
    ),
    [logout, navigation]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.background} />
      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : userData ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.settingsIcon}
                onPress={() => {
                  if (isBottomSheetOpen) {
                    bottomSheetRef.current?.close();
                  } else {
                    bottomSheetRef.current?.expand();
                  }
                }}
              >
                <Ionicons name="settings" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
              <Image
                source={require("../../../assets/profile-placeholder.png")}
                style={styles.profileImage}
              />
              <Text style={styles.title}>Bienvenido, {userData.nombre}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nombre: </Text>
                <Text style={styles.value}>
                  {userData.nombre} {userData.apellido}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.value}>{userData.email}</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
        )}
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Inicia cerrado
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        style={styles.bottomSheet}
      >
        {renderContent}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  settingsIcon: {
    padding: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000", // Sombra de la imagen
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Sombra en Android
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: "#000", // Sombra del contenedor de información
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Sombra en Android
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  bottomSheet: {
    backgroundColor: "#cacfd2",
    shadowColor: "#000", // Sombra del BottomSheet
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Sombra en Android
  },
  bottomSheetContent: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  bottomSheetButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    width: "100%",
    flexDirection: "row",
  },
  bottomSheetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    textAlign: "center",
  },
  bottomSheetCloseButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
  },
  bottomSheetCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PerfilScreen;
