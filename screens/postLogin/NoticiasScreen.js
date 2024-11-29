import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function NoticiasScreen() {
  return (
    <View style={styles.container}>
      <Text>Noticias</Text>
      <Text>Esta pantalla muestra las noticias recientes de la UASD.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

/*
const NoticiasScreen = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    // Obtener el token de AsyncStorage
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Método GET para obtener las noticias
        fetch("https://uasdapi.ia3x.com/noticias", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => setNoticias(data))
        .catch(error => console.error("Error al obtener las noticias:", error));
      }
    };
    getToken();
  }, []);
*/
