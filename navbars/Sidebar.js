/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import supabase from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ setSelectedMarket }) => {
  const [fullName, setFullName] = useState("Loading...");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    } else if (user?.registrationId) {
      const fetchRegistrantName = async () => {
        try {
          const { data, error } = await supabase
            .from("registrant")
            .select("full_name")
            .eq("registration_id", user.registrationId)
            .single();

          if (error) {
            console.error("Error fetching registrant:", error);
            setFullName("Unknown User");
          } else {
            setFullName(data.full_name);
          }
        } catch (error) {
          console.error("Error in fetchRegistrantName:", error);
          setFullName("Unknown User");
        }
      };

      fetchRegistrantName();
    } else {
      setFullName("Unknown User");
    }
  }, [user]);

  const NavItem = ({ label, onPress, isActive }) => (
    <TouchableOpacity
      onPress={() => {
        setActiveItem(label);
        onPress();
      }}
      style={[styles.navItem, isActive && styles.activeNavItem]}
    >
      <Text style={[styles.navText, isActive && styles.activeNavText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleDashboardPress = () => {
    setSelectedMarket?.(null);
    navigation.navigate("MainTabs");
  };

  const handleNCPMPress = () => {
    setSelectedMarket?.("NCPM");
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.sidebar}>
      {/* User Info */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://i.gifer.com/origin/c8/c8d864187433ac0cc77a5a2e057d52d4_w200.gif",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.role}>Satellite Market Stallholder</Text>
      </View>

      {/* Navigation */}
      <Text style={styles.sectionTitle}>Dashboard:</Text>
      <NavItem
        label="Satellite Market"
        onPress={handleDashboardPress}
        isActive={activeItem === "Satellite Market"}
      />
      <NavItem
        label="NCPM"
        onPress={handleNCPMPress}
        isActive={activeItem === "NCPM"}
      />

      <View style={styles.divider} />

      <NavItem
        label="Profile"
        onPress={() => navigation.navigate("Profile")}
        isActive={activeItem === "Profile"}
      />
      <NavItem
        label="i-Message"
        onPress={() => navigation.navigate("i-Message")}
        isActive={activeItem === "i-Message"}
      />

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon
          name="logout"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: "#002181",
    padding: 20,
    height: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  role: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  navItem: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    transition: "background-color 0.2s",
  },
  activeNavItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  activeNavText: {
    color: "white",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#e53935",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Sidebar;
