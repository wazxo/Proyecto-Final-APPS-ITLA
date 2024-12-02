import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Animated,
  Easing,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const { width: screenWidth } = Dimensions.get("window");

export default function TeamScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      name: "Juan Pérez",
      role: "Desarrollador Frontend",
      description:
        "Juan es responsable del desarrollo de interfaces de usuario, creando experiencias atractivas y funcionales.",
      technologies: ["React", "React Native", "JavaScript", "CSS", "HTML"],
      contact: {
        github: "https://github.com/juanperez",
        linkedin: "https://www.linkedin.com/in/juanperez",
        email: "juan.perez@example.com",
        phone: "123-456-7890",
      },
      image: require("../../assets/profile-placeholder.png"),
    },
    {
      name: "María López",
      role: "Diseñadora UI/UX",
      description:
        "María se encarga del diseño visual de la aplicación, asegurando que la experiencia del usuario sea fluida y estética.",
      technologies: ["Figma", "Sketch", "Photoshop", "Illustrator"],
      contact: {
        github: "https://github.com/marialopez",
        linkedin: "https://www.linkedin.com/in/marialopez",
        email: "maria.lopez@example.com",
        phone: "987-654-3210",
      },
      image: require("../../assets/profile-placeholder.png"),
    },
    // Añadir más miembros según sea necesario
  ];

  const carouselRef = useRef(null);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.slide}
        onPress={() => {
          setSelectedMember(item);
          setModalVisible(true);
        }}
      >
        <Image source={item.image} style={styles.profileImage} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.techTitle}>Tecnologías</Text>
        <Text style={styles.technologies}>{item.technologies.join(", ")}</Text>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Equipo de Desarrollo</Text>
      <Carousel
        style={styles.carousel}
        data={teamMembers}
        renderItem={renderItem}
        ref={carouselRef}
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.8}
        loop={false} // Desactivar el loop para que no se repita
        autoplay={true} // Desactivar el autoplay
        inactiveSlideScale={1} // Mantener las tarjetas estáticas
        inactiveSlideOpacity={1} // Evitar el desvanecimiento en las tarjetas inactivas
        enableMomentum={false} // Hacer que el carrusel se detenga al final de la lista
        itemSpacing={100} // Espacio entre las tarjetas
      />

      {/* Modal de contacto */}
      {selectedMember && (
        <Modal
          visible={modalVisible}
          animationType="fade" // Usamos fade para la animación del modal
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={selectedMember.image}
                style={styles.modalProfileImage} // Foto de perfil dentro del modal
              />
              <Text style={styles.modalTitle}>{selectedMember.name}</Text>
              <Text style={styles.modalRole}>{selectedMember.role}</Text>
              <Text style={styles.modalDescription}>
                {selectedMember.description}
              </Text>

              <Text style={styles.modalSubtitle}>Tecnologías</Text>
              <Text style={styles.modalTechnologies}>
                {selectedMember.technologies.join(", ")}
              </Text>

              <Text style={styles.modalSubtitle}>Contacto</Text>
              <Text style={styles.modalContactText}>
                Email: {selectedMember.contact.email}
              </Text>
              <Text style={styles.modalContactText}>
                Teléfono: {selectedMember.contact.phone}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => openLink(selectedMember.contact.github)}
                >
                  <Text style={styles.modalButtonText}>GitHub</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => openLink(selectedMember.contact.linkedin)}
                >
                  <Text style={styles.modalButtonText}>LinkedIn</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={closeModal}
              >
                <Text style={styles.closeModalText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  carousel: {
    marginTop: 20,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    marginHorizontal: 5, // Agrega espacio entre tarjetas de izquierda a derecha
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  technologies: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: screenWidth * 0.8,
    elevation: 5,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  modalRole: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginVertical: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  modalTechnologies: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  modalContactText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
  },
});
