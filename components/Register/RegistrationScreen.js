/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import supabase from "../../supabaseClient";

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    userName: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = Object.values(formData).every((v) => v.trim() !== "");

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Missing Fields", "Please complete all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("registrant")
        .select("user_name")
        .eq("user_name", formData.userName)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (checkError) throw checkError;
      if (existingUser) {
        Alert.alert("Username Taken", "Please choose a different username.");
        return;
      }

      // Insert new registrant
      const { error } = await supabase.from("registrant").insert([
        {
          full_name: formData.fullName,
          email: formData.emailAddress,
          contact_number: formData.phoneNumber,
          address: formData.address,
          user_name: formData.userName,
          password: formData.password,
          status: "pending",
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Account created. Awaiting approval.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);

      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        address: "",
        userName: "",
        password: "",
      });
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          <View style={styles.header}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us today and begin your journey!
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => handleInput("fullName", text)}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.emailAddress}
              onChangeText={(text) => handleInput("emailAddress", text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInput("phoneNumber", text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => handleInput("address", text)}
              placeholder="Enter your address"
              multiline
            />

            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              value={formData.userName}
              onChangeText={(text) => handleInput("userName", text)}
              placeholder="Choose a username"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => handleInput("password", text)}
              placeholder="Create a password"
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.footerLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    ...(Platform.OS === "web" && { height: "100vh", overflow: "hidden" }),
  },
  keyboardAvoid: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    flexGrow: 1,
    minHeight: Platform.OS === "web" ? "130%" : undefined,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    backgroundColor: "#e8f5e8",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#2B8000",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iconText: { fontSize: 32 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2B8000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 15,
    color: "#555",
  },
  footerLink: {
    color: "#2B8000",
    fontWeight: "600",
  },
});

export default RegistrationScreen;
