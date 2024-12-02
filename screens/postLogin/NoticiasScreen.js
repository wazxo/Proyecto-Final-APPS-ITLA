import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native"; // Para detectar cuando la pantalla está enfocada
import { Linking } from "react-native"; // Para abrir URLs

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda
  const isFocused = useIsFocused(); // Verifica si la pantalla está enfocada

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken"); // Obtiene el authToken de AsyncStorage
        if (authToken) {
          const response = await fetch("https://uasdapi.ia3x.com/noticias", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Incluye el authToken en los encabezados de la solicitud
            },
          });

          const data = await response.json();
          if (data.success) {
            setNoticias(data.data); // Actualiza el estado con los datos de las noticias
            setFilteredNoticias(data.data); // Inicializa también las noticias filtradas
          } else {
            Alert.alert("Error", "Failed to load news"); // Muestra una alerta si la solicitud falla
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load news"); // Muestra una alerta si ocurre un error
      } finally {
        setLoading(false); // Finaliza la animación de carga
      }
    };

    if (isFocused) {
      fetchNoticias(); // Llama a la función para obtener las noticias solo cuando la pantalla está enfocada
    }
  }, [isFocused]); // La función se ejecuta cuando la pantalla está enfocada

  // Filtra las noticias según el texto ingresado
  const handleSearch = (text) => {
    setSearchText(text);

    // Filtra por título o por fecha
    const filtered = noticias.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(text.toLowerCase());
      const dateMatch = item.date.toLowerCase().includes(text.toLowerCase());
      return titleMatch || dateMatch; // Filtra por nombre o fecha
    });
    setFilteredNoticias(filtered); // Actualiza las noticias filtradas
  };

  const handlePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir la URL: ", err)
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.url)}
      style={styles.newsItem}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary}>{item.summary}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar noticias por título o fecha"
        value={searchText}
        onChangeText={handleSearch} // Filtra las noticias al escribir
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : filteredNoticias.length === 0 ? (
        <Text style={styles.noNews}>No hay noticias disponibles</Text>
      ) : (
        <FlatList
          data={filteredNoticias}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Fondo más claro
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: "#fff", // Fondo blanco para el input
  },
  newsItem: {
    marginBottom: 20,
    backgroundColor: "#fff", // Fondo blanco para cada noticia
    borderRadius: 10,
    overflow: "hidden", // Para que las imágenes no sobresalgan de la tarjeta
    shadowColor: "#000", // Sombra para un efecto elevado
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3, // Sombra en Android
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Color oscuro para el título
  },
  summary: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginTop: 10,
  },
  noNews: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Noticias;
