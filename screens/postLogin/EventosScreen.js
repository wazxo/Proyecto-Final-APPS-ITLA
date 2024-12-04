import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

const EventosScreen = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Obtener los eventos del usuario
  const fetchEventos = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const response = await axios.get("https://uasdapi.ia3x.com/eventos", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const eventos = response.data || [];
      if (eventos.length === 0) {
        console.log("No hay eventos disponibles.");
        setEventos([]);
        setLoading(false);
        return;
      }

      setEventos(eventos);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los eventos:", error);
      Alert.alert("Error", "No se pudo cargar los eventos.");
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEventos();
    }, [])
  );

  const openInGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir Google Maps", err)
    );
  };

  const moveToLocation = (lat, lng) => {
    mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const renderEvento = ({ item }) => {
    const { coordenadas, lugar } = item;
    const [lat, lng] = coordenadas.split(", ").map(Number);
    const hasValidLocation = lat && lng;

    return (
      <View style={styles.eventoContainer}>
        <Text style={styles.tituloText}>{item.titulo}</Text>
        <Text style={styles.descripcionText}>{item.descripcion}</Text>
        <Text style={styles.fechaText}>
          Fecha: {new Date(item.fechaEvento).toLocaleDateString("es-ES")}
        </Text>
        <Text style={styles.lugarText}>Lugar: {lugar}</Text>
        {hasValidLocation && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => moveToLocation(lat, lng)}
          >
            <Icon name="map-marker" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver en el mapa</Text>
          </TouchableOpacity>
        )}
        {hasValidLocation && (
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => openInGoogleMaps(lat, lng)}
          >
            <Icon name="map" size={20} color="#fff" />
            <Text style={styles.directionsButtonText}>Ir a Maps</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 18.477011029492324,
              longitude: -69.8365311114267,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            provider={PROVIDER_GOOGLE}
          >
            {eventos.map((item) => {
              const { coordenadas } = item;
              const [lat, lng] = coordenadas.split(", ").map(Number);
              console.log(`Evento: ${item.titulo}, Lat: ${lat}, Lng: ${lng}`);
              return (
                <Marker
                  key={item.id}
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  title={item.titulo}
                  description={item.descripcion}
                />
              );
            })}
          </MapView>
          <FlatList
            data={eventos}
            renderItem={renderEvento}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noEventosText}>
                No hay eventos disponibles.
              </Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  eventoContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  tituloText: {
    fontSize: 20,
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  descripcionText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  fechaText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  lugarText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  verEnMapaText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    marginBottom: 10,
  },
  map: {
    height: 450, // Hacer el mapa más largo
    borderRadius: 15,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  noEventosText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  mapButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  directionsButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
});

export default EventosScreen;
