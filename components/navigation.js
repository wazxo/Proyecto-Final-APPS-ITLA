import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "../screens/Login/LoginScreen";
import ResetPasswordScreen from "../screens/Login/ResetPasswordScreen";
import CreateUserScreen from "../screens/Login/RegisterScreen";
import HomeScreen from "../screens/postLogin/LandingScreen";
import GestionAcademicaScreen from "./GestionNav";
import Noticias from "../screens/postLogin/NoticiasScreen";
import RecursosScreen from "../screens/postLogin/RecursosScreen";
import SolicitudesScreen from "../screens/postLogin/SolicitudesScreen";
import ProfileScreen from "../screens/postLogin/PerfilScreen";
import ChangePasswordScreen from "../screens/postLogin/ChangePasswordScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={DrawerContent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DrawerContent = () => {
  return (
    <Drawer.Navigator initialRouteName="Inicio" screenOptions={{
      headerStyle: {
        backgroundColor: "#084f83"
      },
    }}>
      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: "Inicio",
          headerTitleStyle: { fontSize: 18 },
        }}
      />
      <Drawer.Screen
        name="Gestión Académica"
        component={GestionAcademicaScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" size={size} color={color} />
          ),
          headerTitle: "Gestión Académica",
          headerTitleStyle: { fontSize: 18 },
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
          headerTitle: "Recursos",
          headerTitleStyle: { fontSize: 18 },
        }}
      />
      <Drawer.Screen
        name="Noticias"
        component={Noticias}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
          headerTitle: "Noticias",
          headerTitleStyle: { fontSize: 18 },
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
          headerTitle: "Solicitudes",
          headerTitleStyle: { fontSize: 18 },
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: "Perfil",
          headerTitleStyle: { fontSize: 18 },
        }}
      />
    </Drawer.Navigator>
  );
};

const screens = [
  { name: "Login", component: LoginScreen },
  { name: "ResetPassword", component: ResetPasswordScreen },
  { name: "CreateUser", component: CreateUserScreen },
  { name: "DrawerNavigation", component: DrawerNavigator },
];

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {screens.map((screen) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{ headerShown: false }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
