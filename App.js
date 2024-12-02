import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context"; // Importar SafeAreaView
import Navigation from "./components/navigation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigation />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
