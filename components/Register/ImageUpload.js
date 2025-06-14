/* eslint-disable prettier/prettier */
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageUpload({ image, onImageSelected }) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to upload your ID"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.imageContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.previewImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No ID image selected</Text>
        </View>
      )}
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Upload Valid ID</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  previewImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePickerButton: {
    backgroundColor: "#3055D7",
    padding: 10,
    borderRadius: 5,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "500",
  },
});
