import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import GestionAcademicaScreen from "./GestionAcademicaNavigation";
import Noticias from "../screens/postLogin/NoticiasScreen";
import RecursosScreen from "../screens/postLogin/RecursosScreen";
import SolicitudesScreen from "../screens/postLogin/SolicitudesScreen";
import ProfileScreen from "../screens/PerfilScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Inicio">
        <Drawer.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Iniciar sesión"
          component={LoginScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-in" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Gestión Académica"
          component={GestionAcademicaScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="school" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Recursos"
          component={RecursosScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="folder-multiple"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Noticias"
          component={Noticias}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Solicitudes"
          component={SolicitudesScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="file-document-edit"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
