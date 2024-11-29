import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "../screens/Login/LoginScreen";
import ResetPasswordScreen from "../screens/Login/ResetPasswordScreen";
import CreateUserScreen from "../screens/Login/RegisterScreen";
import HomeScreen from "../screens/LandingScreen";
import GestionAcademicaScreen from "./GestionNav";
import Noticias from "../screens/postLogin/NoticiasScreen";
import RecursosScreen from "../screens/postLogin/RecursosScreen";
import SolicitudesScreen from "../screens/postLogin/SolicitudesScreen";
import ProfileScreen from "../screens/PerfilScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
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
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUserScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DrawerNavigation"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
