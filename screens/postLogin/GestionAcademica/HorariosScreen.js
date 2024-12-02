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
  const [schedules, setSchedules] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasPreseleccionadas, setHasPreseleccionadas] = useState(false);

  // Obtener las materias preseleccionadas del usuario
  const fetchPreseleccionadas = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        "https://uasdapi.ia3x.com/ver_preseleccion",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const materias = response.data.data || [];
      if (materias.length === 0) {
        console.log("No hay materias preseleccionadas.");
        // Limpiar la data si no hay materias preseleccionadas
        setSchedules({
          Lunes: [],
          Martes: [],
          Miércoles: [],
          Jueves: [],
          Viernes: [],
          Sábado: [],
          Domingo: [],
        });
        setLoading(false);
        setHasPreseleccionadas(false);
        return;
      }

      setHasPreseleccionadas(true);

      // Obtener las materias disponibles
      const availableMateriasResponse = await axios.get(
        "https://uasdapi.ia3x.com/materias_disponibles",
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const availableMaterias = availableMateriasResponse.data || [];
      console.log("Materias disponibles:", availableMaterias);

      // Agrupar las materias preseleccionadas por día
      const groupedSchedule = {
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: [],
      };

      // Asociar el horario de cada materia preseleccionada con las materias disponibles
      materias.forEach((materia) => {
        // Buscar la materia en las disponibles por su código
        const availableMateria = availableMaterias.find(
          (m) => m.codigo === materia.codigo
        );

        if (availableMateria) {
          const horario = availableMateria.horario;
          if (horario && typeof horario === "string") {
            // Normalizamos el horario (convertimos a minúsculas y eliminamos espacios adicionales)
            const dia = horario.split(" ")[0].toLowerCase().trim(); // Extraemos el día en minúsculas

            // Mapeo de días de la semana
            const diaMap = {
              lunes: "Lunes",
              martes: "Martes",
              miércoles: "Miércoles",
              jueves: "Jueves",
              viernes: "Viernes",
              sábado: "Sábado",
              domingo: "Domingo",
              domingos: "Domingo", // Añadimos "domingos" para manejar este caso específico
            };

            // Si el día es válido, lo agregamos
            if (diaMap[dia]) {
              groupedSchedule[diaMap[dia]].push(availableMateria);
            } else {
              console.warn(`Día no válido para ${materia.nombre}:`, dia);
            }
          } else {
            console.warn(
              `El horario de la materia ${materia.nombre} no es válido:`,
              horario
            );
          }
        }
      });

      // Actualizamos el estado con el horario agrupado
      setSchedules(groupedSchedule);
      setLoading(false); // Dejar de mostrar la animación de carga
    } catch (error) {
      console.error("Error al obtener las materias:", error);
      Alert.alert("Error", "No se pudo cargar las materias.");
      setLoading(false); // Dejar de mostrar la animación de carga
    }
  };

  // Llamada a la API cuando la pantalla se monta o vuelve a recibir foco
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setLoading(true); // Mostrar el indicador de carga cuando la pantalla recibe foco
      fetchPreseleccionadas();
    });

    return () => {
      navigation.removeListener("focus", focusListener); // Limpiar el listener cuando se deje de mostrar la pantalla
    };
  }, [navigation]);

  // Renderizar el horario agrupado por día
  const renderSchedule = (dia, index) => {
    const materias = schedules[dia];

    return (
      <View key={index} style={styles.dayContainer}>
        <Text style={styles.dayText}>{dia}</Text>
        {materias.length > 0 ? (
          materias.map((materia, idx) => (
            <View key={idx} style={styles.materiaContainer}>
              <Text style={styles.materiaText}>{materia.nombre}</Text>
              <Text style={styles.horarioText}>{materia.horario}</Text>
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

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loader: {
    flex: 1,
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    position: "absolute", // Para que se coloque encima de los demás componentes
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
    textTransform: "capitalize", // Para asegurar que los días estén con la primera letra en mayúscula
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
