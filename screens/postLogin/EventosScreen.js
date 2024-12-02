import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_KEY } from "../../config"; // Asegúrate de definir tu API_KEY en config.js
import Icon from "react-native-vector-icons/FontAwesome"; // Importamos FontAwesome para los iconos
import moment from "moment"; // Para formatear la fecha

const EventosScreen = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 18.7357, // Valor inicial por defecto
    longitude: -70.1627, // Valor inicial por defecto
    latitudeDelta: 4,
    longitudeDelta: 4,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (!storedToken) {
          Alert.alert("Error", "No se encontró el token de autenticación");
          return;
        }

        const response = await fetch("https://uasdapi.ia3x.com/eventos", {
          headers: {
            Authorization: storedToken,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
        Alert.alert("Error", "Ocurrió un problema al cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleEventoPress = (coordenadas) => {
    const [latitude, longitude] = coordenadas.split(", ").map(Number);
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01, // Menor delta para mayor zoom
      longitudeDelta: 0.01, // Menor delta para mayor zoom
    });

    // Llamada a la geocodificación para obtener la dirección
    geocodeLatLng(latitude, longitude);
  };

  const geocodeLatLng = async (latitude, longitude) => {
    const latlng = `${latitude},${longitude}`;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${API_KEY}`
      );

      if (response.data.status === "OK") {
        const formattedAddress = response.data.results[0].formatted_address;
        setAddress(formattedAddress);
        setModalVisible(true);
      } else {
        Alert.alert("Error", "No se pudo encontrar la dirección");
      }
    } catch (error) {
      Alert.alert("Error", `Falló la geocodificación: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={region}>
        {eventos.map((evento) => {
          const [latitude, longitude] = evento.coordenadas
            .split(", ")
            .map(Number);
          return (
            <Marker
              key={evento.id}
              coordinate={{ latitude, longitude }}
              title={evento.titulo}
              description={evento.descripcion}
              pinColor="#3498db" // Color personalizado para los marcadores
            />
          );
        })}
      </MapView>

      <View style={styles.eventosContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <FlatList
            data={eventos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eventoItem}
                onPress={() => handleEventoPress(item.coordenadas)}
              >
                <Text style={styles.eventoTitulo}>{item.titulo}</Text>
                <Text style={styles.eventoDescripcion}>{item.descripcion}</Text>
                <Text style={styles.eventoFecha}>
                  {moment(item.fechaEvento).format("MMMM Do YYYY, h:mm a")}
                </Text>
                <Text style={styles.eventoLugar}>{item.lugar}</Text>
                <Text style={styles.eventoCoordenadas}>
                  Coordenadas: {item.coordenadas}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <Modal
        animationType="fade" // Cambiado a "fade" para el desvanecimiento
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles</Text>
            <Text style={styles.modalText}>Dirección: {address}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="times-circle" size={30} color="#fff" />
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Fondo claro
  },
  map: {
    flex: 2,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  eventosContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, // Para que la lista se superponga ligeramente con el mapa
  },
  eventoItem: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10, // Para sombra en Android
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  eventoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  eventoDescripcion: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  eventoFecha: {
    fontSize: 14,
    color: "#16a085",
    marginBottom: 5,
  },
  eventoLugar: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 5,
  },
  eventoCoordenadas: {
    fontSize: 12,
    color: "#bdc3c7",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo oscuro pero translúcido
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    elevation: 15, // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
});

export default EventosScreen;
