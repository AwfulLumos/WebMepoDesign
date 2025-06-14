/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from "react-native";
import supabase from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const EditProfileScreen = ({ navigation, route }) => {
  const { user } = useAuth(); // Get the authenticated user
  const profile = route.params?.profileData;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profile) {
      console.log("Profile data received:", profile);
      setName(profile.name || profile.full_name || "");
      setAddress(profile.address || "");
      setContact(profile.contact || profile.contact_number || "");
      setUsername(profile.username || profile.user_name || "");
      setEmail(profile.email || "");
      setPassword(profile.password || "");
    }
  }, [profile]);

  const handleSave = async () => {
    // Check if user is authenticated
    if (!user || !user.registrationId) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    if (!name || !address || !contact || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("registrant")
        .update({
          full_name: name,
          address: address,
          contact_number: contact,
          user_name: username,
          email: email,
          password: password,
        })
        .eq("registration_id", user.registrationId); // Use dynamic registration ID

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        navigation.goBack();
      }, 2000);

      Alert.alert("Success", "Your profile was updated.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading or error if user is not available
  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>User not authenticated</Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Information</Text>

      {/* Show current user info for reference */}
      <View style={styles.userInfoCard}>
        <Text style={styles.userInfoText}>
          Editing profile for: {user.fullName} ({user.email})
        </Text>
      </View>

      {successMessage ? (
        <View style={styles.successCard}>
          <Icon name="check-circle" size={20} color="#28a745" />
          <Text style={styles.successCardText}>{successMessage}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text.trim())}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        <Icon name="check" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>
          {loading ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Icon name="close" size={20} color="#fff" />
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6200ea",
    alignSelf: "center",
  },
  userInfoCard: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  userInfoText: {
    color: "#1565c0",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  successMessage: {
    color: "#28a745",
    fontSize: 14,
    marginBottom: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#82c796",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "500",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "500",
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4ea",
    borderColor: "#28a745",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successCardText: {
    color: "#1e4620",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 14,
  },
});

export default EditProfileScreen;
