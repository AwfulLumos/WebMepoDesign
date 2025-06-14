/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import supabase from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

const YourStallsScreen = ({ route }) => {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [yourStalls, setYourStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const isLargeScreen = screenData.width >= 1024;
  const isMediumScreen = screenData.width >= 768;

  useEffect(() => {
    const fetchStalls = async () => {
      // Wait for auth to load and check if user is logged in
      if (authLoading) {
        return; // Still loading auth state
      }

      if (!isLoggedIn || !user || !user.registrationId) {
        console.log("User not logged in or registrationId not available");
        setYourStalls([]); // Set empty array when no user
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching stalls for registrationId:", user.registrationId);

        const { data, error } = await supabase
          .from("stall")
          .select("*")
          .eq("registrant_id", user.registrationId);

        if (error) {
          console.error("Error fetching stalls:", error);
          setYourStalls([]);
        } else {
          console.log("Fetched stalls:", data);
          setYourStalls(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setYourStalls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
  }, [user, isLoggedIn, authLoading]);

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
    outputRange: [0, 150],
  });

  const handleImagePress = (image) => {
    if (image) {
      setSelectedImage(image);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const styles = getStyles(isLargeScreen, isMediumScreen, screenData);

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#002181" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show error state if user is not logged in
  if (!isLoggedIn || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please log in to view your stalls
          </Text>
          <Text style={styles.errorSubtext}>
            You need to be logged in to access this feature
          </Text>
        </View>
      </View>
    );
  }

  // Show error state if registrationId is not available
  if (!user.registrationId) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to load stalls: User registration ID not found
          </Text>
          <Text style={styles.errorSubtext}>
            Please contact support if this issue persists
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Stalls</Text>
        <Text style={styles.userInfo}>Welcome, {user.fullName}</Text>
        <TouchableOpacity
          onPress={toggleDescription}
          style={styles.dropdownHeader}
        >
          <Text style={styles.dropdownText}>
            Stall Overview <Text>{isExpanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.descriptionContainer, { maxHeight }]}>
          <Text style={styles.headerDescription}>
            This page displays all the stalls that are currently assigned to you
            as a tenant. You can view each stall's details, including location,
            type, and rental status. Use this page to keep track of your stall
            assignments, monitor your payment status, and stay updated on
            important notices related to each stall.
          </Text>
        </Animated.View>
      </View>

      {/* View Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Stall List */}
      {yourStalls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stalls found</Text>
          <Text style={styles.emptySubtext}>
            You don't have any stalls assigned yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={yourStalls}
          keyExtractor={(item) => item.stall_id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => handleImagePress(item.image_url)}
                  style={styles.imageContainer}
                >
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.imageOverlay}>
                    <Text style={styles.viewText}>
                      {item.image_url ? "View" : "No Image"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Stall No: </Text>
                    {item.stall_no}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Location: </Text>
                    {item.stall_location}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Size: </Text>
                    {item.size}
                  </Text>
                </View>
              </View>
              {item.description && (
                <Text style={styles.description}>
                  <Text style={{ fontWeight: "600" }}>Description: </Text>
                  {item.description}
                </Text>
              )}
              <View style={{ height: 20 }} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const getStyles = (isLargeScreen, isMediumScreen, screenData) =>
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
    userInfo: {
      fontSize: isLargeScreen ? 16 : 14,
      color: "#e0e0e0",
      marginTop: 5,
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
      color: "#000",
      lineHeight: isLargeScreen ? 22 : 20,
    },
    loadingText: {
      marginTop: 10,
      textAlign: "center",
      color: "#666",
      fontSize: isLargeScreen ? 16 : 14,
    },
    card: {
      backgroundColor: "#ffffff",
      padding: isLargeScreen ? 25 : isMediumScreen ? 22 : 18,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
      marginBottom: isLargeScreen ? 20 : isMediumScreen ? 18 : 15,
    },
    rowContainer: {
      flexDirection: isLargeScreen ? "row" : isMediumScreen ? "row" : "column",
      alignItems: isLargeScreen
        ? "flex-start"
        : isMediumScreen
          ? "flex-start"
          : "center",
      marginBottom: 15,
    },
    imageContainer: {
      position: "relative",
      marginRight: isLargeScreen ? 25 : isMediumScreen ? 20 : 0,
      marginBottom: isLargeScreen ? 0 : isMediumScreen ? 0 : 15,
      cursor: "pointer",
    },
    image: {
      width: isLargeScreen ? 140 : isMediumScreen ? 120 : 100,
      height: isLargeScreen ? 140 : isMediumScreen ? 120 : 100,
      borderRadius: 8,
    },
    placeholderImage: {
      width: isLargeScreen ? 140 : isMediumScreen ? 120 : 100,
      height: isLargeScreen ? 140 : isMediumScreen ? 120 : 100,
      borderRadius: 8,
      backgroundColor: "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ddd",
    },
    placeholderText: {
      color: "#999",
      fontSize: isLargeScreen ? 16 : isMediumScreen ? 15 : 14,
      textAlign: "center",
    },
    imageOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: isLargeScreen ? 8 : 6,
      alignItems: "center",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    viewText: {
      color: "white",
      fontSize: isLargeScreen ? 14 : isMediumScreen ? 13 : 12,
      fontWeight: "bold",
    },
    detailsContainer: {
      flex: 1,
      justifyContent: "flex-start",
    },
    details: {
      fontSize: isLargeScreen ? 16 : isMediumScreen ? 15 : 14,
      color: "#000000",
      marginBottom: 8,
      lineHeight: isLargeScreen ? 22 : isMediumScreen ? 20 : 18,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      position: "absolute",
      top: isLargeScreen ? 50 : isMediumScreen ? 40 : 30,
      right: isLargeScreen ? 50 : isMediumScreen ? 40 : 30,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 25,
      width: isLargeScreen ? 50 : isMediumScreen ? 45 : 40,
      height: isLargeScreen ? 50 : isMediumScreen ? 45 : 40,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
      cursor: "pointer",
    },
    closeButtonText: {
      color: "white",
      fontSize: isLargeScreen ? 24 : isMediumScreen ? 22 : 20,
      fontWeight: "bold",
    },
    modalImage: {
      width:
        screenData.width * (isLargeScreen ? 0.8 : isMediumScreen ? 0.85 : 0.9),
      height:
        screenData.height * (isLargeScreen ? 0.7 : isMediumScreen ? 0.65 : 0.6),
      borderRadius: 10,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: isLargeScreen ? 40 : isMediumScreen ? 35 : 30,
    },
    errorText: {
      fontSize: isLargeScreen ? 24 : isMediumScreen ? 22 : 20,
      fontWeight: "bold",
      color: "#d32f2f",
      textAlign: "center",
      marginBottom: 15,
    },
    errorSubtext: {
      fontSize: isLargeScreen ? 18 : isMediumScreen ? 16 : 14,
      color: "#666",
      textAlign: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: isLargeScreen ? 40 : isMediumScreen ? 35 : 30,
    },
    emptyText: {
      fontSize: isLargeScreen ? 24 : isMediumScreen ? 22 : 20,
      fontWeight: "bold",
      color: "#666",
      textAlign: "center",
      marginBottom: 15,
    },
    emptySubtext: {
      fontSize: isLargeScreen ? 18 : isMediumScreen ? 16 : 14,
      color: "#999",
      textAlign: "center",
    },
    headerDescription: {
      color: "#e0e0e0",
    },
  });

export default YourStallsScreen;
