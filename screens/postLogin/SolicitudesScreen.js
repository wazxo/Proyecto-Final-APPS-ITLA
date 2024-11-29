import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function SolicitudesYTareasScreen() {
  return (
    <View style={styles.container}>
      <Text>Solicitudes y Tareas</Text>
      <Text>
        Esta pantalla gestiona solicitudes administrativas y tareas pendientes.
      </Text>
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
const TareasScreen = () => {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    // Obtener el token de AsyncStorage
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Método GET para obtener las tareas del usuario
        fetch("https://uasdapi.ia3x.com/tareas", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => setTareas(data))
        .catch(error => console.error("Error al obtener las tareas:", error));
      }
    };
    getToken();
  }, []);


  const SolicitudesScreen = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    // Obtener el token de AsyncStorage
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Método GET para obtener las solicitudes del usuario
        fetch("https://uasdapi.ia3x.com/solicitudes", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => setSolicitudes(data))
        .catch(error => console.error("Error al obtener las solicitudes:", error));
      }
    };
    getToken();
  }, []);
*/
