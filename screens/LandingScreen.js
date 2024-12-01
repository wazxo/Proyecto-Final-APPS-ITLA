import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Logo from "../assets/logo_uasd.svg";

const { width: screenWidth } = Dimensions.get("window");

export default function LandingScreen() {
  const img = require("../assets/prueba6.jpg");
  const mision =
    "Su Misión es formar críticamente profesionales, investigadores y técnicos en las ciencias, las humanidades y las artes necesarias y eficientes para coadyuvar a las transformaciones que demanda el desarrollo nacional sostenible, así como difundir los ideales de la cultura de paz, progreso, justicia social, equidad de género y respeto a los derechos humanos, a fin de contribuir a la formación de una conciencia colectiva basada en valores.";
  const vision =
    "La Universidad tiene como Visión ser una institución de excelencia y liderazgo académico, gestionada con eficiencia y acreditada nacional e internacionalmente; con un personal docente, investigador, extensionistas y egresados de alta calificación; creadora de conocimientos científicos y nuevas tecnologías, y reconocida por su contribución al desarrollo humano con equidad y hacia una sociedad democrática y solidaria.";
  const valores = `
La Universidad está orientada hacia el respeto y la defensa de la dignidad humana y se sustenta en los siguientes valores:
    
    - Solidaridad
    - Transparencia
    - Verdad
    - Igualdad
    - Libertad
    - Equidad
    - Tolerancia
    - Responsabilidad
    - Convivencia
    - Paz
  `;

  const images = [
    require("../assets/image1.png"),
    require("../assets/imagen2.jpeg"),
    require("../assets/imagen3.jpg"),
    require("../assets/imgen4.png"),
  ];

  const carouselRef = useRef(null);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={item} style={styles.image} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={img} style={styles.imageBackground}>
        <View style={styles.overlay} />
        <View style={styles.carouselContainer}>
          <Carousel
            style={styles.wrapper}
            data={images}
            renderItem={renderItem}
            ref={carouselRef}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            loop={true}
            autoplay={true}
            autoplayInterval={3000}
          />
        </View>
        <View style={styles.containerData}>
          <Logo
            width={300}
            height={200}
            style={{ alignSelf: "center", marginTop: 200 }}
          />
          <Text style={styles.text}>Misino, Vision y Valores</Text>
          <Text style={styles.title}>Mision</Text>
          <Text style={styles.subTitle}>{mision}</Text>

          <Text style={styles.title}>Vision</Text>
          <Text style={styles.subTitle}>{vision}</Text>

          <Text style={styles.title}>Valores</Text>
          <Text style={styles.subTitle}>{valores}</Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerData: {
    flex: 1,
  },
  logo: {
    justifyContent: "center",
    width: 100,
    height: 200,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  carouselContainer: {
    height: 200,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    margin: 10,
  },
  subTitle: {
    color: "white",
    fontSize: 20,
    textAlign: "justify",
    margin: 10,
  },
});
