/* eslint-disable prettier/prettier */
import { useNotifications } from "../contexts/NotificationContext";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from "react-native";

const stall1 = require("../assets/images/stall1.jpg");
const stall2 = require("../assets/images/stall2.jpg");

const auctions = [
  {
    id: "1",
    stall_no: "19",
    zone: "Zone A",
    floor_level: "1st Floor",
    section: "Vegetable Section",
    width: "3m",
    height: "4m",
    starting_bid: "₱5,000",
    description:
      "A spacious stall with good ventilation, ideal for fresh produce. Includes built-in shelves.",
    auction_date: "March 30, 2025 - 10:00 AM",
    minimum_increment: "₱500",
    image: stall1,
  },
  {
    id: "2",
    stall_no: "25",
    zone: "Zone B",
    floor_level: "2nd Floor",
    section: "Dry Goods Section",
    width: "4m",
    height: "5m",
    starting_bid: "₱7,500",
    description:
      "A well-located stall suitable for clothing, accessories, or dry goods. Good foot traffic.",
    auction_date: "April 5, 2025 - 2:00 PM",
    minimum_increment: "₱750",
    image: stall2,
  },
  {
    id: "3",
    stall_no: "32",
    zone: "Zone C",
    floor_level: "Ground Floor",
    section: "Meat Section",
    width: "3.5m",
    height: "4.5m",
    starting_bid: "₱6,500",
    description:
      "A stall designed for meat vendors with a dedicated drainage system and easy access for deliveries.",
    auction_date: "April 10, 2025 - 9:00 AM",
    minimum_increment: "₱600",
    image: stall1,
  },
  {
    id: "4",
    stall_no: "41",
    zone: "Zone D",
    floor_level: "1st Floor",
    section: "Seafood Section",
    width: "3m",
    height: "4m",
    starting_bid: "₱5,500",
    description:
      "Located near the main entrance, this stall is perfect for seafood vendors. Includes a built-in counter.",
    auction_date: "April 15, 2025 - 11:00 AM",
    minimum_increment: "₱550",
    image: stall2,
  },
  {
    id: "5",
    stall_no: "50",
    zone: "Zone E",
    floor_level: "2nd Floor",
    section: "Food Court",
    width: "4.5m",
    height: "5m",
    starting_bid: "₱10,000",
    description:
      "A prime food court stall with high customer traffic. Perfect for a small restaurant or café.",
    auction_date: "April 20, 2025 - 1:00 PM",
    minimum_increment: "₱1,000",
    image: stall1,
  },
];

const AuctionScreen = () => {
  const { addNotification } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
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

  const toggleExpand = () => {
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

  const handlePreRegisterAll = () => {
    addNotification(
      "You have pre-registered for all auctions, please stand by for the date of the auction at the office of the MEPO."
    );
    console.log("Pre-Register clicked for all auctions");
    setSuccessModalVisible(true);
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const styles = getStyles(isLargeScreen, isMediumScreen, screenData);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Auction Page</Text>
        <TouchableOpacity onPress={toggleExpand} style={styles.dropdownHeader}>
          <Text style={styles.dropdownText}>
            Auction Overview <Text>{isExpanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.descriptionContainer, { maxHeight }]}>
          <Text style={styles.headerDescription}>
            Stallholders can view and pre-register for available stalls in
            MEPO-managed markets. Admins list stalls with key details below. The
            Pre-Register button allows you to participate in upcoming auction
            events at the MEPO Office.
          </Text>
        </Animated.View>
      </View>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successModalBackground}>
          <View style={styles.successModalContent}>
            <Text style={styles.successMessage}>
              Pre-registered successfully!{"\n"}See notifications to check.
            </Text>
            <TouchableOpacity
              style={styles.closeSuccessButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.closeSuccessButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
              source={selectedImage}
              style={{
                width: screenData.width * 0.9,
                height: screenData.height * 0.6,
                borderRadius: 10,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Stall Cards */}
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.preRegisterButton}
              onPress={handlePreRegisterAll}
            >
              <Text style={styles.preRegisterButtonText}>
                Pre-Register for All Auctions
              </Text>
            </TouchableOpacity>
            <View style={{ height: isLargeScreen ? 25 : 20 }} />
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <View style={styles.card}>
              <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => handleImagePress(item.image)}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.viewText}>View</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Location: </Text>
                    {item.zone}, {item.floor_level}, {item.section}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Width x Height: </Text>
                    {item.width} x {item.height}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Starting Bid: </Text>
                    {item.starting_bid}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Min Increment: </Text>
                    {item.minimum_increment}
                  </Text>
                  <Text style={styles.details}>
                    <Text style={{ fontWeight: "600" }}>Auction Date: </Text>
                    {item.auction_date}
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={{ height: isLargeScreen ? 25 : 20 }} />
          </View>
        )}
      />
    </View>
  );
};

const getStyles = (isLargeScreen, isMediumScreen, screenData) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: isLargeScreen ? 25 : isMediumScreen ? 20 : 15,
      paddingVertical: isLargeScreen ? 30 : 25,
      maxWidth: isLargeScreen ? 1200 : 1000,
      alignSelf: "center",
      width: "100%",
    },
    headerContainer: {
      backgroundColor: "#002181",
      padding: isLargeScreen ? 20 : 18,
      borderRadius: 8,
      marginBottom: isLargeScreen ? 25 : 20,
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
      color: "#000",
      lineHeight: isLargeScreen ? 22 : 20,
    },
    preRegisterButton: {
      backgroundColor: "#28a745",
      padding: isLargeScreen ? 18 : 15,
      borderRadius: 8,
      alignItems: "center",
      width: "100%",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    preRegisterButtonText: {
      fontSize: isLargeScreen ? 18 : 16,
      color: "#ffffff",
      fontWeight: "bold",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: isLargeScreen ? 25 : 20,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
      marginBottom: isLargeScreen ? 25 : 20,
    },
    rowContainer: {
      flexDirection: isMediumScreen ? "row" : "column",
      alignItems: isMediumScreen ? "flex-start" : "center",
      marginBottom: 15,
    },
    image: {
      width: isLargeScreen ? 160 : isMediumScreen ? 140 : 120,
      height: isLargeScreen ? 160 : isMediumScreen ? 140 : 120,
      borderRadius: 8,
      marginRight: isMediumScreen ? 25 : 0,
      marginBottom: isMediumScreen ? 0 : 15,
    },
    imageOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: isMediumScreen ? 25 : 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 8,
      alignItems: "center",
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    viewText: {
      color: "white",
      fontSize: isLargeScreen ? 16 : 14,
      fontWeight: "bold",
    },
    detailsContainer: {
      flex: 1,
      justifyContent: "flex-start",
    },
    details: {
      fontSize: isLargeScreen ? 16 : isMediumScreen ? 15 : 14,
      color: "#333",
      marginBottom: 8,
      lineHeight: isLargeScreen ? 22 : 20,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      position: "absolute",
      top: 50,
      right: 50,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
      cursor: "pointer",
    },
    closeButtonText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    successModalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    successModalContent: {
      width: isLargeScreen ? 400 : isMediumScreen ? 350 : 300,
      backgroundColor: "#fff",
      padding: isLargeScreen ? 35 : 30,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 8,
    },
    successMessage: {
      fontSize: isLargeScreen ? 20 : 18,
      textAlign: "center",
      marginBottom: 25,
      color: "#28a745",
      lineHeight: isLargeScreen ? 26 : 24,
    },
    closeSuccessButton: {
      backgroundColor: "#28a745",
      paddingVertical: 12,
      paddingHorizontal: isLargeScreen ? 35 : 30,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    closeSuccessButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isLargeScreen ? 18 : 16,
    },
    headerDescription: {
      color: "#e0e0e0",
    },
  });

export default AuctionScreen;
