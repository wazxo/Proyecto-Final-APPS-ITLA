import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Linking } from "react-native";

const teamMembers = [
  {
    name: "Lidia Maria Quiñones",
    description:
      "Cada línea de código que escribes es un ladrillo en el castillo que estás construyendo. ¡Confía en el proceso y sigue aprendiendo, porque las grandes ideas comienzan con pequeños pasos!",
    technologies: ["React", "React Native", "JavaScript", "CSS", "HTML"],
    contact: {
      github: "https://github.com/liliii7",
      linkedin: "https://www.linkedin.com/in/juanperez",
      email: "lidiaquinones2005@gmail.com",
      phone: "123-456-7890",
    },
    image: require("../../assets/lidia.jpg"),
  },
  {
    name: "Samuel Ruiz Espinosa",
    description:
      "El mejor código no solo es el que funciona, sino el que construimos juntos. ¡Sigue aportando tus ideas y habilidades, porque en equipo se logran grandes cosas!",
    technologies: ["Java", "HTML - CSS", "Node.Js", "C#"],
    contact: {
      github: "https://github.com/SamuelAlex899",
      linkedin: " www.linkedin.com/in/samuel-alexander-ruiz-espinosa-tecnólogo-en-desarrollo-de-software-682550242",
      email: "samuelruizjs@gmail.com",
      phone: "849-388-8054",
    },
    image: require("../../assets/samuel.jpg"),
  },
  {
    name: "Daniel José Domínguez",
    description:
      "El progreso no siempre se mide en líneas de código, sino en la claridad que ganas con cada desafío. ¡No te detengas, estás creciendo más de lo que crees!",
    technologies: ["Figma", "Sketch", "Photoshop", "Illustrator"],
    contact: {
      github: "https://github.com/marialopez",
      linkedin: "https://www.linkedin.com/in/Danieljose",
      email: "danielitojdg68@gmail.com",
      phone: "829-934-6304",
    },
    image: require("../../assets/daniel.jpg"),
  },
  {
    name: "Johelin Perez Valdez",
    description:
      "Recuerda, un bug no es un obstáculo, sino una oportunidad para aprender algo nuevo y ser mejor. ¡Eres más fuerte que cualquier error en tu código.",
    technologies: ["Figma", "Sketch", "Photoshop", "Illustrator"],
    contact: {
      github: "http://github.com/wazxo",
      linkedin: "https://www.linkedin.com/in/Johelinperez",
      email: "johelinperez@gmail.com",
      phone: "829-934-6304",
    },
    image: require("../../assets/johelin.jpg"),
  },
  {
    name: "Juan Alberto Moreno Adon",
    description:
      "El mundo necesita de tus ideas y de tu talento. Sigue persiguiendo esa visión, porque lo que hoy parece un sueño, mañana puede ser tu legado.",
    technologies: ["Figma", "Sketch", "Photoshop", "Illustrator"],
    contact: {
      github: "http://github.com/wazxo",
      linkedin: "https://www.linkedin.com/in/juanAlberto",
      email: "Juanalberto@gmail.com",
      phone: "829-934-6304",
    },
    image: require("../../assets/alberto.jpg"),
  },


];

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMember(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.teamContainer}>
        {teamMembers.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => openModal(member)}
          >
            <Image source={member.image} style={styles.image} />
            <Text style={styles.cardName}>{member.name}</Text>
            <Text style={styles.cardRole}>{member.role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMember && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedMember.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedMember.name}</Text>
              <Text style={styles.modalRole}>{selectedMember.role}</Text>
              <Text style={styles.modalDescription}>{selectedMember.description}</Text>
              <Text style={styles.modalTechnologies}>
                <Text style={styles.bold}>Tecnologías:</Text> {selectedMember.technologies.join(", ")}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => Linking.openURL(selectedMember.contact.github)}
                >
                  <Text style={styles.modalButtonText}>GitHub</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => Linking.openURL(selectedMember.contact.linkedin)}
                >
                  <Text style={styles.modalButtonText}>LinkedIn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => Linking.openURL(`mailto:${selectedMember.contact.email}`)}
                >
                  <Text style={styles.modalButtonText}>Correo</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  teamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 150,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardRole: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  modalRole: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalTechnologies: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default App;
