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
import SolicitudesScreen from "../screens/postLogin/solicitudes/SolicitudesScreen";
import ProfileScreen from "../screens/postLogin/Perfil/PerfilScreen";
import ChangePasswordScreen from "../screens/postLogin/Perfil/ChangePasswordScreen";
import BecaScreen from "../screens/postLogin/solicitudes/tiposSolicitudes/BecaScreen";
import EventosScreen from "../screens/postLogin/EventosScreen";
import AcercaDe from "../screens/postLogin/AcercaDe";
import { Text } from "react-native";

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
      <Stack.Screen
        name="Solicitud"
        component={BecaScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DrawerContent = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerStyle: { backgroundColor: "#f8f9fa" }, // Color de fondo del header
        drawerActiveTintColor: "#007bff", // Color del texto activo en el drawer
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Inicio
            </Text>
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
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Gestión Académica
            </Text>
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
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Recursos
            </Text>
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
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Noticias
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Eventos"
        component={EventosScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Eventos
            </Text>
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
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Solicitudes
            </Text>
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
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Perfil
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Acerca de"
        component={AcercaDe}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="information"
              size={size}
              color={color}
            />
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, maxWidth: 200 }} numberOfLines={1}>
              Acerca de
            </Text>
          ),
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
