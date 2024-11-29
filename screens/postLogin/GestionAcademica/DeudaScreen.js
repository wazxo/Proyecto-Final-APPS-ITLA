import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeudaScreen() {
  return (
    <View style={styles.container}>
      <Text>Deuda</Text>
      <Text>Aquí puedes consultar tu deuda con la universidad.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

/* 

const DeudasScreen = () => {
  const [deudas, setDeudas] = useState([]);

  useEffect(() => {
    // Obtener el token de AsyncStorage
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        // Método GET para obtener las deudas del usuario
        fetch("https://uasdapi.ia3x.com/deudas", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => setDeudas(data))
        .catch(error => console.error("Error al obtener las deudas:", error));
      }
    };
    getToken();
  }, []);

*/
