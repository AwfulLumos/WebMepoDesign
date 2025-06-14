/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import custom navigation components
import { BottomTabs } from "./navbars/BottomTab";
import Sidebar from "./navbars/Sidebar";

// Screen imports
import MessagingPage from "./components/MessagingPage";
import NotificationScreen from "./components/NotificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import IMessageScreen from "./components/IMessageScreen";
import LoginScreen from "./components/LoginScreen";

import RegistrationScreen from "./components/Register/RegistrationScreen";

import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Navigation containers
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MessageStack = createStackNavigator();
const AuthStack = createStackNavigator();

const MessageStackNavigator = () => (
  <MessageStack.Navigator>
    <MessageStack.Screen
      name="IMessageScreen"
      component={IMessageScreen}
      options={{
        headerShown: true,
        headerTitle: "i-Message",
        headerTitleAlign: "center",
      }}
    />
    <MessageStack.Screen
      name="MessagingPage"
      component={MessagingPage}
      options={{
        headerShown: true,
        headerTitle: "Chat",
        headerTitleAlign: "center",
      }}
    />
  </MessageStack.Navigator>
);

// Profile Stack Navigator (Profile and Edit Profile)
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{
        headerShown: true,
        headerTitle: "Profile",
        headerTitleAlign: "center",
      }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: true,
        headerTitle: "Edit Profile",
        headerTitleAlign: "center",
      }}
    />
  </ProfileStack.Navigator>
);

// Authentication Stack Navigator - Updated to include Registration
const AuthStackNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
    <AuthStack.Screen
      name="RegisterScreen"
      component={RegistrationScreen}
      options={{
        headerShown: true,
        headerTitle: "Create Account",
        headerTitleAlign: "center",
      }}
    />
  </AuthStack.Navigator>
);

// Main Stack Navigator (without hamburger menu since sidebar is always visible)
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={BottomTabs}
      options={({ route, navigation }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";
        return {
          headerShown: true,
          headerTitle: routeName,
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Notification")}
            >
              <Icon name="bell-outline" size={24} color="#000" />
            </TouchableOpacity>
          ),
        };
      }}
    />
    <Stack.Screen
      name="MessagingPage"
      component={MessagingPage}
      options={{
        headerShown: true,
        headerTitle: "Chat",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{
        headerShown: true,
        headerTitle: "Notification",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: true,
        headerTitle: "Edit Profile",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="i-Message"
      component={MessageStackNavigator}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

// Main Layout with Permanent Sidebar
const MainLayout = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);

  return (
    <View style={styles.container}>
      <Sidebar setSelectedMarket={setSelectedMarket} />
      <View style={styles.contentContainer}>
        <MainStack />
      </View>
    </View>
  );
};

// Main App Navigation Component
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainLayout} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Navigation
export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
  },
});
