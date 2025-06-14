/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const initialDocuments = [
  { id: "1", name: "Barangay Clearance", date: null, image: null },
  { id: "2", name: "Business Permit", date: null, image: null },
  { id: "3", name: "BIR Registration", date: null, image: null },
  { id: "4", name: "Social Security System (SSS)", date: null, image: null },
  { id: "5", name: "Occupancy Permit", date: null, image: null },
  { id: "6", name: "Sanitary Permit", date: null, image: null },
];

const DocumentScreen = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  const animation = useRef(new Animated.Value(0)).current;

  // Handle screen dimension changes
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  // Determine layout based on screen width
  const isLargeScreen = screenData.width >= 1024;
  const isMediumScreen = screenData.width >= 768;

  const handleImagePress = (imageUri) => {
    setFullImageUri(imageUri);
    setFullImageVisible(true);
  };

  const handlePress = (item) => {
    setSelectedDocument(item);
    setModalVisible(true);
  };

  const toggleDescription = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === selectedDocument.id
            ? { ...doc, image: result.assets[0].uri, date: formattedDate }
            : doc
        )
      );

      setModalVisible(false);
    }
  };

  const styles = getStyles(isLargeScreen, isMediumScreen);

  return (
    <View style={styles.container}>
      {/* Header - Updated to match DashboardScreen */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Document Management</Text>
        <TouchableOpacity
          onPress={toggleDescription}
          style={styles.dropdownHeader}
        >
          <Text style={styles.dropdownText}>
            Document Overview <Text>{isExpanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.descriptionContainer, { maxHeight }]}>
          <Text style={styles.description}>
            This page provides stallholders with a convenient and organized way
            to upload, view, and manage the official documents required by the
            Market Enterprise and Promotion Office (MEPO). Each document listed
            is essential for verifying the legitimacy and operational readiness
            of their business within the market facility. To ensure compliance
            with government and market regulations, all uploaded documents are
            subject to periodic renewal. Specifically, each document must be
            renewed and updated in the system every 1 year and 6 months.
          </Text>
        </Animated.View>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.card}
          >
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.imagePreview} />
            )}
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardValue}>Uploaded: {item.date || "N/A"}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Document Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDocument?.name}</Text>
            <Text style={styles.modalText}>
              Uploaded: {selectedDocument?.date || "N/A"}
            </Text>

            {selectedDocument?.image && (
              <TouchableOpacity
                onPress={() => handleImagePress(selectedDocument.image)}
              >
                <Image
                  source={{ uri: selectedDocument.image }}
                  style={styles.modalImage}
                />
              </TouchableOpacity>
            )}

            <Pressable style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {selectedDocument?.image ? "Change Image" : "Upload Image"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Full Image Modal */}
      <Modal visible={fullImageVisible} transparent={true}>
        <TouchableOpacity
          style={styles.fullImageContainer}
          onPress={() => setFullImageVisible(false)}
          activeOpacity={1}
        >
          <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (isLargeScreen, isMediumScreen) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: isLargeScreen ? 25 : isMediumScreen ? 20 : 15,
      backgroundColor: "#f5f5f5",
      maxWidth: isLargeScreen ? 1200 : 1000,
      alignSelf: "center",
      width: "100%",
    },
    headerContainer: {
      backgroundColor: "#002181",
      padding: isLargeScreen ? 20 : 18,
      borderRadius: 8,
      marginVertical: isLargeScreen ? 25 : 20,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      fontSize: isLargeScreen ? 26 : isMediumScreen ? 24 : 22,
      fontWeight: "bold",
      color: "#ffffff",
    },
    dropdownHeader: {
      marginTop: 12,
      cursor: "pointer",
    },
    dropdownText: {
      fontSize: isLargeScreen ? 18 : 16,
      color: "#f5f5f5",
    },
    descriptionContainer: {
      overflow: "hidden",
      marginTop: 12,
    },
    description: {
      fontSize: isLargeScreen ? 16 : 14,
      color: "#e0e0e0",
      lineHeight: isLargeScreen ? 22 : 20,
    },
    card: {
      backgroundColor: "#28a745",
      padding: 25,
      borderRadius: 10,
      width: "48%",
      minHeight: 150,
      justifyContent: "center",
      marginBottom: 25,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#ffffff",
      marginTop: 10,
    },
    cardValue: {
      fontSize: 16,
      color: "#ffffff",
      marginTop: 5,
    },
    imagePreview: {
      width: "100%",
      height: 100,
      borderRadius: 8,
      marginBottom: 10,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 25,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#002181",
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 15,
      color: "#333",
    },
    modalImage: {
      width: 200,
      height: 150,
      borderRadius: 10,
      marginBottom: 15,
    },
    uploadButton: {
      backgroundColor: "#002181",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginBottom: 10,
    },
    uploadButtonText: {
      color: "#fff",
      fontSize: 16,
    },
    closeButton: {
      marginTop: 5,
    },
    closeButtonText: {
      color: "#002181",
      fontSize: 16,
    },
    fullImageContainer: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
    },
    fullImage: {
      width: "90%",
      height: "80%",
      resizeMode: "contain",
    },
  });

export default DocumentScreen;
