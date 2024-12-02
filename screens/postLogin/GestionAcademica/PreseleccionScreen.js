import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const MateriasScreen = ({ navigation }) => {
  const [materias, setMaterias] = useState([]);
  const [preseleccionadas, setPreseleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthToken = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
        if (!authToken) {
          Alert.alert("Error", "Debes iniciar sesión primero.");
          navigation.navigate("Login");
        } else {
          fetchMateriasDisponibles();
          fetchPreseleccionadas();
        }
      };
      checkAuthToken();
    }, [])
  );

  const fetchMateriasDisponibles = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "https://uasdapi.ia3x.com/materias_disponibles",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMaterias(response.data || []);
    } catch (error) {
      console.error("Error al obtener las materias disponibles:", error);
      Alert.alert("Error", "No se pudo cargar las materias disponibles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreseleccionadas = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "https://uasdapi.ia3x.com/ver_preseleccion",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setPreseleccionadas(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener las preselecciones:", error);
      Alert.alert("Error", "No se pudo cargar las preselecciones.");
    }
  };

  const preseleccionarMateria = async (codigo) => {
    // Verificar si la materia ya está preseleccionada
    const materiaYaPreseleccionada = preseleccionadas.some(
      (materia) => materia.codigo === codigo
    );

    if (materiaYaPreseleccionada) {
      // Si ya está preseleccionada, mostrar un mensaje y salir de la función
      Alert.alert("Error", "Esta materia ya está preseleccionada.");
      return;
    }

    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        "https://uasdapi.ia3x.com/preseleccionar_materia",
        JSON.stringify(codigo),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Éxito", "Materia preseleccionada.");
        fetchPreseleccionadas(); // Actualizar la lista de preseleccionadas
        bottomSheetRef.current?.close(); // Cerrar el BottomSheet
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo preseleccionar la materia.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarPreseleccion = async (codigo) => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        "https://uasdapi.ia3x.com/cancelar_preseleccion_materia",
        JSON.stringify(codigo),
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Éxito", "Materia cancelada.");
        fetchPreseleccionadas();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la preselección.");
    } finally {
      setLoading(false);
    }
  };

  const openBottomSheet = (materia) => {
    setSelectedMateria(materia);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    setSelectedMateria(null);
    bottomSheetRef.current?.close();
  };

  const renderMateria = ({ item }) => (
    <TouchableOpacity
      style={styles.materiaCard}
      onPress={() => openBottomSheet(item)}
    >
      <Text style={styles.materiaTitle}>{item.nombre}</Text>
      <Text style={styles.materiaInfo}>Horario: {item.horario}</Text>
      <Text style={styles.materiaInfo}>Aula: {item.aula}</Text>
    </TouchableOpacity>
  );

  const renderPreseleccion = ({ item }) => (
    <View style={styles.preseleccionCard}>
      <Text style={styles.materiaTitle}>{item.nombre}</Text>
      <Text style={styles.materiaInfo}>Horario: {item.horario}</Text>
      <Text style={styles.materiaInfo}>Aula: {item.aula}</Text>
      <Text style={styles.materiaInfo}>Ubicación: {item.ubicacion}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => cancelarPreseleccion(item.codigo)}
      >
        <Icon name="times-circle" size={20} color="#fff" />
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBottomSheetContent = useMemo(
    () => (
      <BottomSheetView style={styles.bottomSheetContent}>
        {selectedMateria && (
          <>
            <Text style={styles.modalTitle}>Preseleccionar Materia</Text>
            <Text style={styles.materiaTitle}>{selectedMateria.nombre}</Text>
            <Text style={styles.materiaInfo}>{selectedMateria.horario}</Text>
            <Text style={styles.materiaInfo}>{selectedMateria.aula}</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => preseleccionarMateria(selectedMateria.codigo)}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={closeBottomSheet}
            >
              <Icon name="times-circle" size={20} color="#fff" />
              <Text style={styles.confirmText}>Cerrar</Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetView>
    ),
    [selectedMateria]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Sección de Materias Disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materias Disponibles</Text>
          <FlatList
            data={materias}
            keyExtractor={(item) => item.codigo}
            renderItem={renderMateria}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={styles.flatList}
          />
        </View>

        {/* Sección de Preseleccionadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Preselecciones</Text>
          {preseleccionadas.length === 0 ? (
            <Text style={styles.noPreseleccionText}>
              No tienes preselecciones.
            </Text>
          ) : (
            <FlatList
              data={preseleccionadas}
              keyExtractor={(item) => item.codigo}
              renderItem={renderPreseleccion}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              style={styles.flatList}
            />
          )}
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Inicia cerrado
        onChange={(index) => setIsBottomSheetOpen(index !== -1)}
        enablePanDownToClose={true}
        style={styles.bottomSheet}
      >
        {renderBottomSheetContent}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  section: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  flatList: {
    flexGrow: 0,
  },
  materiaCard: {
    flex: 1,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8, // Reducido el radio de borde
    padding: 12, // Reducido el padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materiaTitle: {
    fontSize: 14, // Reducido el tamaño de fuente
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  materiaInfo: {
    fontSize: 12, // Reducido el tamaño de fuente
    color: "#666",
    marginTop: 4,
  },
  preseleccionCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8, // Reducido el radio de borde
    padding: 12, // Reducido el padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
  },
  closeModalButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  noPreseleccionText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    alignContent: "center",
    backgroundColor: "#cacfd2",
    shadowColor: "#000", // Sombra del BottomSheet
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Sombra en Android
  },
  bottomSheetContent: {
    alignContent: "center",
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    padding: 8,
  },
});

export default MateriasScreen;
