/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import screens for Bottom Tabs
import DashboardScreen from "../components/DashboardScreen";
import DocumentScreen from "../components/DocumentScreen";
import AuctionScreen from "../components/AuctionScreen";
import YourStallsScreen from "../components/YourStallsScreen";

const Tab = createBottomTabNavigator();

export const getTabIcon = (routeName) => {
  switch (routeName) {
    case "Dashboard":
      return "view-dashboard";
    case "Your Stalls":
      return "storefront-outline";
    case "Documents":
      return "file-document";
    case "i-Message":
      return "message-text";
    case "Auction":
      return "gavel";
    default:
      return "circle";
  }
};

export const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => (
        <Icon name={getTabIcon(route.name)} size={size} color={color} />
      ),
      tabBarActiveTintColor: "#6200ea",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "bold",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Your Stalls" component={YourStallsScreen} />
    <Tab.Screen name="Documents" component={DocumentScreen} />
    <Tab.Screen name="Auction" component={AuctionScreen} />
  </Tab.Navigator>
);
