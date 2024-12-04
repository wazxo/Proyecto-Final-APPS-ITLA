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

const HorarioScreen = ({ navigation }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener los horarios del usuario
  const fetchHorarios = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get("https://uasdapi.ia3x.com/horarios", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const horarios = response.data || [];
      if (horarios.length === 0) {
        console.log("No hay horarios disponibles.");
        setSchedules([]);
        setLoading(false);
        return;
      }

      // Agrupar los horarios por día
      const groupedSchedule = {
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: [],
      };

      horarios.forEach((horario) => {
        const fecha = new Date(horario.fechaHora);
        const diaSemana = fecha.toLocaleDateString("es-ES", {
          weekday: "long",
        });
        const diaMap = {
          lunes: "Lunes",
          martes: "Martes",
          miércoles: "Miércoles",
          jueves: "Jueves",
          viernes: "Viernes",
          sábado: "Sábado",
          domingo: "Domingo",
        };

        if (diaMap[diaSemana]) {
          groupedSchedule[diaMap[diaSemana]].push(horario);
        } else {
          console.warn(`Día no válido para ${horario.materia}:`, diaSemana);
        }
      });

      setSchedules(groupedSchedule);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los horarios:", error);
      Alert.alert("Error", "No se pudo cargar los horarios.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setLoading(true);
      fetchHorarios();
    });

    return () => {
      navigation.removeListener("focus", focusListener);
    };
  }, [navigation]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const renderSchedule = (dia, index) => {
    const materias = schedules[dia];

    return (
      <View key={index} style={styles.dayContainer}>
        <Text style={styles.dayText}>{dia}</Text>
        {materias.length > 0 ? (
          materias.map((materia, idx) => (
            <View key={idx} style={styles.materiaContainer}>
              <Text style={styles.materiaText}>{materia.materia}</Text>
              <Text style={styles.horarioText}>
                {formatDate(materia.fechaHora)}
              </Text>
              <Text style={styles.aulaText}>Aula: {materia.aula}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noMateriasText}>
            No hay materias para este día.
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={Object.keys(schedules)}
          renderItem={({ item, index }) => renderSchedule(item, index)}
          keyExtractor={(item) => item}
          ListEmptyComponent={
            <Text style={styles.noMateriasText}>
              No hay horarios disponibles.
            </Text>
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
  scrollViewContainer: {
    paddingBottom: 30,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  materiaContainer: {
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
  materiaText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "bold",
  },
  horarioText: {
    fontSize: 15,
    color: "#555",
  },
  aulaText: {
    fontSize: 13,
    color: "#777",
  },
  noMateriasText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});

export default HorarioScreen;
