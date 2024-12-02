import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const SolicitudesScreen = ({ navigation }) => {
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const tiposSolicitudes = [
    {
      codigo: "beca",
      descripcion: "Solicitud de beca",
      icon: "school-outline",
      color: "#4CAF50",
    },
    {
      codigo: "carta_estudio",
      descripcion: "Carta de estudios",
      icon: "document-text-outline",
      color: "#2196F3",
    },
    {
      codigo: "record_nota",
      descripcion: "Record de nota",
      icon: "clipboard-outline",
      color: "#FF9800",
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const getTokenAndFetchSolicitudes = async () => {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          fetchSolicitudes(token); // Realiza la solicitud solo si hay token
        } else {
          Alert.alert("Error", "No se encontró el token de autenticación");
        }
      };

      getTokenAndFetchSolicitudes();

      return () => {
        // Esto es opcional y se ejecutará cuando la pantalla deje de estar en foco
        // Puedes limpiar o hacer algo si es necesario cuando la pantalla ya no está en foco
      };
    }, [])
  );

  const fetchSolicitudes = (token) => {
    fetch("https://uasdapi.ia3x.com/mis_solicitudes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setMisSolicitudes(data.data);
        } else {
          Alert.alert("Error", "Error en la respuesta de la API");
        }
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Error al obtener mis solicitudes");
        setLoading(false);
      });
  };

  const cancelarSolicitud = async (id) => {
    try {
      // Obtener el token de autorización desde AsyncStorage
      const authToken = await AsyncStorage.getItem("authToken");

      if (!authToken) {
        Alert.alert("Error", "No se encontró el token de autorización");
        return;
      }

      // Realizar la solicitud de cancelación
      const response = await fetch(
        "https://uasdapi.ia3x.com/cancelar_solicitud",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`, // Usar el token desde AsyncStorage
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(id), // Enviar el ID como número
        }
      );

      // Verificar si la respuesta tiene contenido antes de parsear
      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Respuesta vacía de la API");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new Error("Error al parsear la respuesta de la API");
      }

      if (data.success) {
        Alert.alert("Éxito", "Solicitud cancelada exitosamente");

        // Después de cancelar la solicitud, hacer la petición nuevamente para obtener la lista actualizada
        const authToken = await AsyncStorage.getItem("authToken");
        if (authToken) {
          fetchSolicitudes(authToken); // Volver a cargar las solicitudes
        } else {
          Alert.alert("Error", "No se encontró el token de autenticación");
        }
      } else {
        Alert.alert("Error", "No se pudo cancelar la solicitud");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un problema al intentar cancelar la solicitud"
      );
    }
  };

  const renderSolicitud = ({ item }) => (
    <TouchableOpacity
      style={[styles.solicitudesContainer, { backgroundColor: item.color }]}
      onPress={() => {
        navigation.navigate("Solicitud", { tipo: item.codigo });
      }}
    >
      <Ionicons name={item.icon} size={40} color="#fff" style={styles.icon} />
      <Text style={styles.titulo}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  const renderMisSolicitud = ({ item }) => {
    return (
      <View style={styles.misSolicitudesContainer}>
        <View style={styles.misSolicitudesTextContainer}>
          <Text style={styles.titulo1}>{item.tipo}</Text>
          <Text
            style={styles.descripcion}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.estado}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => cancelarSolicitud(item.id)}
        >
          <Ionicons name="trash-outline" size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sección de Tipos de Solicitudes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Solicitudes</Text>
        <FlatList
          data={tiposSolicitudes}
          keyExtractor={(item) => item.codigo}
          key={"fixed-columns"} // Fuerza un renderizado estático
          renderItem={renderSolicitud}
          numColumns={3} // Tres columnas
          columnWrapperStyle={styles.row} // Espaciado entre filas
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sección de Mis Solicitudes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Solicitudes</Text>
        {misSolicitudes.length === 0 ? (
          <Text style={styles.noSolicitudesText}>No hay solicitudes</Text>
        ) : (
          <FlatList
            data={misSolicitudes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMisSolicitud}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  section: {
    marginTop: 16, // Espaciado controlado entre secciones
    backgroundColor: "#e0e0e0", // Color de fondo para las secciones
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8, // Menor separación del contenido siguiente
  },
  solicitudesContainer: {
    flex: 1,
    aspectRatio: 1, // Hace que las tarjetas sean cuadradas
    margin: 8, // Espaciado entre tarjetas
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    justifyContent: "space-between", // Espaciado uniforme entre columnas
  },
  icon: {
    marginBottom: 8,
  },
  titulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  titulo1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  noSolicitudesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  misSolicitudesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  misSolicitudesTextContainer: {
    flex: 1,
  },
  descripcion: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    paddingLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SolicitudesScreen;
