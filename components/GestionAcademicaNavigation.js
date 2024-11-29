import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HorariosScreen from "../screens/postLogin/GestionAcademica/HorariosScreen";
import PreseleccionScreen from "../screens/postLogin/GestionAcademica/PreseleccionScreen";
import DeudaScreen from "../screens/postLogin/GestionAcademica/DeudaScreen";

const Tab = createBottomTabNavigator();

function GestionAcademicaScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#f8f8f8" },
      }}
    >
      <Tab.Screen
        name="Horarios"
        component={HorariosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Preselección"
        component={PreseleccionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deuda"
        component={DeudaScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wallet" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default GestionAcademicaScreen;
