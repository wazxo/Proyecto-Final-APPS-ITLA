import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";

// Obtener el ancho de la pantalla
const { width: screenWidth } = Dimensions.get("window");

export default function LandingScreen() {
  const img = require("../assets/imagenUni.jpg");

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
    <View style={styles.container}>
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
        <Text style={styles.text}>UASD</Text>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    lineHeight: 84,
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
});
