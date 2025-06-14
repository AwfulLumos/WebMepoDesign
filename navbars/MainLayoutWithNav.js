/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { BottomTabs } from "./navbars/NavigationComponents";
import DrawerContent from "./navbars/NavigationComponents"; // reuse as top nav
import MessagingPage from "./components/MessagingPage";
import NotificationScreen from "./components/NotificationScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import ProfileScreen from "./components/ProfileScreen";
import IMessageScreen from "./components/IMessageScreen";

const Stack = createStackNavigator();

const MainLayoutWithNav = () => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <DrawerContent />
      </View>
      <View style={styles.contentArea}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="MessagingPage" component={MessagingPage} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="i-Message" component={IMessageScreen} />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MainLayoutWithNav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    height: 100,
    backgroundColor: "#002181",
    justifyContent: "center",
  },
  contentArea: {
    flex: 1,
  },
});
