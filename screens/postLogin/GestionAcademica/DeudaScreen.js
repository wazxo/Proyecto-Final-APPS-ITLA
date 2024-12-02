import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeudaScreen({ navigation }) {
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0]; // Inicializando la animación

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        fetchDeudas(token);
      } else {
        Alert.alert("Error", "No se encontró el token de autenticación");
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      // Activar la animación cuando el modal se hace visible
      Animated.timing(fadeAnim, {
        toValue: 1, // Animación al valor máximo (opacidad completa)
        duration: 300, // Duración de la animación
        useNativeDriver: true,
      }).start();
    } else {
      // Reiniciar la animación cuando el modal se cierra
      Animated.timing(fadeAnim, {
        toValue: 0, // Animación al valor mínimo (opacidad 0)
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const fetchDeudas = (token) => {
    fetch("https://uasdapi.ia3x.com/deudas", {
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
        setDeudas(data);
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Error al obtener las deudas");
        setLoading(false);
      });
  };

  const handleCardNumberChange = (number) => {
    setCardNumber(number);
    if (number.startsWith("4")) {
      setCardType("Visa");
    } else {
      setCardType("Unknown");
    }
  };

  const handlePayment = () => {
    // Validación de campos
    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    // Simulando que el pago no está funcionando
    Alert.alert(
      "Aviso",
      "El sistema de pago no está funcionando en este momento."
    );
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const renderDeuda = ({ item }) => (
    <View style={styles.deudaCard}>
      <Text style={styles.deudaText}>Monto: ${item.monto}</Text>
      <Text style={styles.deudaText}>
        Fecha: {new Date(item.fechaActualizacion).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.pagarButton}
        onPress={() => {
          setSelectedDeuda(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.pagarButtonText}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Deuda</Text>
      <FlatList
        data={deudas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDeuda}
        contentContainerStyle={styles.deudaList}
      />

      {/* Modal de pago */}
      <Modal
        animationType="none" // Desactivamos la animación de la modal por defecto
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View
          style={[styles.modalContainer, { opacity: fadeAnim }]} // Aplicamos la animación de opacidad
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de Pago</Text>

            {selectedDeuda && (
              <View style={styles.deudaDetails}>
                <Text style={styles.deudaDetailText}>
                  Monto: ${selectedDeuda.monto}
                </Text>
                <Text style={styles.deudaDetailText}>
                  Fecha:{" "}
                  {new Date(
                    selectedDeuda.fechaActualizacion
                  ).toLocaleDateString()}
                </Text>
              </View>
            )}

            {/* Formulario de pago */}
            <TextInput
              style={styles.input}
              placeholder="Número de Tarjeta"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de Expiración (MM/AA)"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
            <Text style={styles.cardType}>Tipo de Tarjeta: {cardType}</Text>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    cardNumber && expiryDate && cvv ? "#28a745" : "#d6d6d6",
                },
              ]}
              onPress={handlePayment}
              disabled={!cardNumber || !expiryDate || !cvv}
            >
              <Text style={styles.buttonText}>Pagar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    color: "#007bff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  deudaList: {
    marginBottom: 20,
  },
  deudaCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  deudaText: {
    fontSize: 18,
    color: "#495057",
    textAlign: "center",
    marginBottom: 8,
  },
  pagarButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  pagarButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 16,
  },
  deudaDetails: {
    marginBottom: 16,
  },
  deudaDetailText: {
    fontSize: 16,
    color: "#495057",
  },
  input: {
    height: 50,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  cardType: {
    fontSize: 18,
    color: "#495057",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#ffffff",
  },
});
