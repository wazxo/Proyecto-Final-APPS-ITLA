
# Proyecto UASD App

Aplicación móvil para gestionar la información académica y administrativa de la Universidad Autónoma de Santo Domingo (UASD), desarrollada con **React Native** y **React Navigation**.

---

## Dependencias

### Principales
- *React Native*: Framework principal para construir la aplicación.
- *React Navigation*: Sistema de navegación para React Native.
  - @react-navigation/native: ^7.0.9
  - @react-navigation/stack: ^7.0.14
  - @react-navigation/drawer: ^7.0.14
  - @react-navigation/bottom-tabs: ^7.0.14
- *React Native Vector Icons*: Para usar íconos vectoriales en la app.
  - react-native-vector-icons: ^10.2.0
  - @expo/vector-icons: ^14.0.4
- *AsyncStorage*: Para almacenar el token de autenticación de manera persistente.
  - @react-native-async-storage/async-storage: ^2.1.0

### Otros
- *Expo*: Herramienta para desarrollar y gestionar la app en dispositivos Android e iOS.
  - expo: ~52.0.11
  - expo-status-bar: ~2.0.0
- *React*: La librería de JavaScript para construir interfaces de usuario.
  - react: 18.3.1
- *React Native Gestures & Animations*: Para gestos y animaciones en la aplicación.
  - react-native-gesture-handler: ~2.20.2
  - react-native-reanimated: ~3.16.1
- *React Native Safe Area*: Para manejar áreas seguras en dispositivos con pantallas recortadas.
  - react-native-safe-area-context: ^4.14.0
- *React Native Screens*: Para optimizar la navegación en React Native.
  - react-native-screens: ~4.1.0

---

## Instalación de Dependencias

```bash
npm install @react-native-async-storage/async-storage@^2.1.0 @react-navigation/native@^7.0.9 @react-navigation/stack@^7.0.14 @react-navigation/drawer@^7.0.14 @react-navigation/bottom-tabs@^7.0.14 react-native-vector-icons@^10.2.0 react-native-gesture-handler@~2.20.2 react-native-reanimated@~3.16.1 react-native-safe-area-context@^4.14.0 react-native-screens@~4.1.0
```

Si usas **Expo**, asegúrate de instalar también los iconos con:

```bash
expo install react-native-vector-icons
```

---

## Estructura de Archivos

```
/src
  /screens
    /Login
      - LoginScreen.js
      - ResetPasswordScreen.js
      - RegisterScreen.js
    /LandingScreen.js
    /postLogin
      /GestionAcademica
        - HorariosScreen.js
        - PreseleccionScreen.js
        - DeudaScreen.js
      - NoticiasScreen.js
      - RecursosScreen.js
      - SolicitudesScreen.js
      - PerfilScreen.js
  /navigation
    - App.js
    - GestionNav.js
```

---

## Flujo de Navegación

La aplicación utiliza **React Navigation** para manejar el flujo entre pantallas:

### 1. Pantallas de Autenticación
- **LoginScreen**: Pantalla de inicio de sesión.
- **ResetPasswordScreen**: Pantalla para restablecer la contraseña.
- **RegisterScreen**: Pantalla para crear un nuevo usuario.

### 2. Pantalla Principal
- **DrawerNavigator**: Menú lateral con las siguientes opciones:
  - **Inicio** (HomeScreen)
  - **Gestión Académica** (GestionAcademicaScreen, incluye:
    - Horarios
    - Preselección
    - Deuda)
  - **Recursos** (RecursosScreen)
  - **Noticias** (NoticiasScreen)
  - **Solicitudes** (SolicitudesScreen)
  - **Perfil** (ProfileScreen)

### 3. Token de Autenticación
- Redirige a **DrawerNavigator** si el usuario está autenticado, o a las pantallas de login, restablecimiento de contraseña o registro si no lo está.

---

## API

### Métodos POST

#### 1. Iniciar Sesión (Login)

- **Endpoint**: `/login`
- **Cuerpo de la solicitud**:
  ```json
  {
    "username": "usuario",
    "password": "contraseña"
  }
  ```
- **Respuesta**:
  ```json
  {
    "success": true,
    "data": {
      "authToken": "token_de_autenticacion",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com"
    }
  }
  ```

#### 2. Restablecer Contraseña (Reset Password)

- **Endpoint**: `/reset_password`
- **Cuerpo de la solicitud**:
  ```json
  {
    "usuario": "usuario",
    "email": "usuario@example.com"
  }
  ```
- **Respuesta**:
  ```json
  {
    "success": true,
    "message": "Se ha enviado un enlace para restablecer tu contraseña."
  }
  ```

#### 3. Crear Usuario (Register)

- **Endpoint**: `/register`
- **Cuerpo de la solicitud**:
  ```json
  {
    "username": "nuevoUsuario",
    "email": "nuevoUsuario@example.com",
    "password": "contraseña"
  }
  ```
- **Respuesta**:
  ```json
  {
    "success": true,
    "message": "Usuario creado exitosamente."
  }
  ```

---

### Métodos GET

Ejemplo de solicitud autenticada:

```javascript
const fetchData = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await fetch("https://uasdapi.ia3x.com/user_data", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    // Procesar datos
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};
```

---

## Autenticación y Manejo de Tokens

El token de autenticación es manejado mediante **AsyncStorage**.

### Guardar Token al Iniciar Sesión

```javascript
const login = async () => {
  try {
    const response = await fetch("https://uasdapi.ia3x.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
      await AsyncStorage.setItem("authToken", data.data.authToken);
      await AsyncStorage.setItem("userData", JSON.stringify(data.data));
      navigation.navigate("DrawerNavigation");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    Alert.alert("Error", "Hubo un problema al intentar iniciar sesión");
  }
};
```

### Uso del Token en Solicitudes

```javascript
const fetchData = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await fetch("https://uasdapi.ia3x.com/protected_data", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
```
