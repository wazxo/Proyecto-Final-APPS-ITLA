import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TareasScreen = ({ navigation }) => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las tareas del usuario
  const fetchTareas = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await axios.get("https://uasdapi.ia3x.com/tareas", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const tareas = response.data || [];
      if (tareas.length === 0) {
        console.log("No hay tareas disponibles.");
        setTareas([]);
        setLoading(false);
        return;
      }

      setTareas(tareas);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      Alert.alert("Error", "No se pudo cargar las tareas.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setLoading(true);
      fetchTareas();
    });

    return () => {
      navigation.removeListener("focus", focusListener);
    };
  }, [navigation]);

  const renderTarea = ({ item }) => (
    <View style={styles.tareaContainer}>
      <Text style={styles.tituloText}>{item.titulo}</Text>
      <Text style={styles.descripcionText}>{item.descripcion}</Text>
      <Text style={styles.fechaText}>
        Vence:{" "}
        {format(new Date(item.fechaVencimiento), "PPPP p", { locale: es })}
      </Text>
      <Text
        style={item.completada ? styles.completadaText : styles.pendienteText}
      >
        {item.completada ? "Completada" : "Pendiente"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={tareas}
          renderItem={renderTarea}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.noTareasText}>No hay tareas disponibles.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tareaContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  tituloText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "bold",
  },
  descripcionText: {
    fontSize: 15,
    color: "#555",
  },
  fechaText: {
    fontSize: 13,
    color: "#777",
  },
  completadaText: {
    fontSize: 13,
    color: "#28a745",
  },
  pendienteText: {
    fontSize: 13,
    color: "#dc3545",
  },
  noTareasText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});

export default TareasScreen;
