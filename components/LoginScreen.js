/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import supabase from "../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("savedUsername");
        const savedPassword = await AsyncStorage.getItem("savedPassword");
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");

        if (savedUsername && savedPassword && savedRememberMe === "true") {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Login Failed", "Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("registrant")
        .select("*")
        .eq("user_name", username)
        .eq("password", password)
        .eq("status", "approved");

      if (error) {
        console.error("Supabase error:", error);
        Alert.alert(
          "Login Failed",
          error.message || "An error occurred. Please try again."
        );
        return;
      }

      if (!data || data.length === 0) {
        Alert.alert("Login Failed", "Incorrect username or password.");
        return;
      }

      const user = data[0];

      if (rememberMe) {
        await AsyncStorage.setItem("savedUsername", username);
        await AsyncStorage.setItem("savedPassword", password);
        await AsyncStorage.setItem("rememberMe", "true");
      } else {
        await AsyncStorage.removeItem("savedUsername");
        await AsyncStorage.removeItem("savedPassword");
        await AsyncStorage.removeItem("rememberMe");
      }

      await login({
        email: user.email || "",
        fullName: user.full_name || "",
        registrationId: user.registration_id,
      });

      console.log("Login successful for user:", user.full_name);
      console.log("Registration ID:", user.registration_id);
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    // wala pang laman.
    navigation.navigate("RegisterScreen");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Naga City Stall</Text>

          <View style={styles.boxWrapper}>
            <View style={styles.greenBar} />

            <View style={styles.blueBox}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={rememberMe ? "checked" : "unchecked"}
                  onPress={() => setRememberMe(!rememberMe)}
                  color="#fff"
                />
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginText}>
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.link}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.greenBar} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Naga Stall © 2024–2025</Text>
            <Text style={styles.footerText}>University of Nueva Caceres</Text>
            <Text style={styles.footerText}>
              Market Enterprise and Promotions Office
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { alignItems: "center", paddingVertical: 20 },
  logo: { width: 150, height: 150, resizeMode: "contain", marginTop: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0c1c60",
    marginVertical: 10,
  },
  boxWrapper: { width: "100%", marginVertical: 20 },
  greenBar: { height: 15, backgroundColor: "#0f9d00" },
  blueBox: {
    backgroundColor: "#2f54eb",
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  checkboxLabel: {
    color: "#fff",
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: "#0f9d00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  loginText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  footer: { alignItems: "center", marginTop: 30, padding: 10 },
  footerText: { fontSize: 12, color: "#6B7280" },
});

export default LoginScreen;
