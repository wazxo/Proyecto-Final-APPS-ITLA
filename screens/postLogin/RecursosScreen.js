import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview"; // Para mostrar videos embebidos
import Icon from "react-native-vector-icons/FontAwesome"; // Importar íconos

const RecursosScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Para animar la opacidad

  // Obtener los videos de la API
  const fetchVideos = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      if (!authToken) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }

      const response = await axios.get("https://uasdapi.ia3x.com/videos", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const videosData = response.data || [];
      setVideos(videosData);
      setLoading(false);

      // Animar la opacidad cuando los datos se cargan
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error al obtener los videos:", error);
      Alert.alert("Error", "No se pudieron cargar los videos.");
      setLoading(false);
    }
  };

  // Llamada a la API cuando la pantalla se monta
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setLoading(true); // Mostrar el indicador de carga cuando la pantalla recibe foco
      fetchVideos();
    });

    return () => {
      navigation.removeListener("focus", focusListener); // Limpiar el listener cuando se deje de mostrar la pantalla
    };
  }, [navigation]);

  // Renderizar cada video
  const renderVideo = ({ item }) => {
    return (
      <Animated.View style={[styles.videoCard, { opacity: fadeAnim }]}>
        <Text style={styles.videoTitle}>{item.titulo}</Text>
        <Text style={styles.videoDate}>
          Publicado el: {new Date(item.fechaPublicacion).toLocaleDateString()}
        </Text>

        {/* Video embebido con WebView (opcional si deseas mostrar el video directamente) */}
        <WebView
          style={styles.webview}
          source={{ uri: `https://www.youtube.com/embed/${item.url}` }}
        />

        {/* Enlace a YouTube con el ícono */}
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() =>
            Linking.openURL(`https://www.youtube.com/watch?v=${item.url}`)
          }
        >
          <Icon name="youtube" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.link}>Ver en YT</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

// Estilos mejorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 30,
  },
  videoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  videoDate: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  webview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  linkContainer: {
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#ff0000", // Color rojo de YouTube
    borderRadius: 8,
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center", // Para centrar el contenido
  },
  link: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 10, // Espacio entre el ícono y el texto
  },
  icon: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
});

export default RecursosScreen;
