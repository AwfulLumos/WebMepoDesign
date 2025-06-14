/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import supabase from "../supabaseClient";

const DashboardScreen = () => {
  const [payments, setPayments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const announcements = [
    {
      id: "1",
      title: "📢 New Lease & Tenant Management System Now Live!",
      text: `Dear Tenants, 

We are pleased to introduce our new Lease and Tenant Management System designed to make your experience more seamless and efficient. Through this platform, you can now access your lease details, track payment history, and receive updates — all in one convenient place. Say goodbye to long queues and paperwork!

We encourage all tenants to explore the new features and take advantage of the improved services. Our team is also ready to assist you with any questions you may have. Thank you for being a valued part of our community.`,
    },
    {
      id: "2",
      title: "📄 Your Important Papers Are Now Easier to Reach!",
      text: `Great news! All your essential documents — including lease agreements, receipts, and notices — are now securely available online. 

No more rummaging through piles of paper or waiting for office hours. With just a few clicks, you can view, download, and print your records anytime and anywhere using your phone or computer.

Please log in to your account to explore the 'Documents' section and enjoy this new convenience. Stay organized, stay informed!`,
    },
    {
      id: "3",
      title: "📝 Payment Reminders & Maintenance Made Easy",
      text: `Never miss a due date again! Our system will now send you friendly reminders when your rent is due, helping you stay on track with your payments.

Additionally, you can now report maintenance concerns directly through the system — whether it's a leaking pipe, a broken light, or any issue in your stall or space. Just submit a request and our maintenance team will get notified right away.

We're making sure your experience is smooth, convenient, and hassle-free. Keep an eye on your dashboard for upcoming updates!`,
    },
  ];

  const currentAnnouncement = announcements[currentAnnouncementIndex];

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

  const getCardWidth = () => {
    if (isLargeScreen) return "23%"; // 4 columns on large screens
    if (isMediumScreen) return "31%"; // 3 columns on medium screens
    return "48%"; // 2 columns on small screens
  };

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payment")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data);
      }
    };

    fetchPayments();
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    const intervalId = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentAnnouncementIndex(
          (prevIndex) => (prevIndex + 1) % announcements.length
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

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

  const styles = getStyles(isLargeScreen, isMediumScreen, getCardWidth());

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity
          onPress={toggleDescription}
          style={styles.dropdownHeader}
        >
          <Text style={styles.dropdownText}>
            Dashboard Overview <Text>{isExpanded ? "▲" : "▼"}</Text>
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.descriptionContainer, { maxHeight }]}>
          <Text style={styles.description}>
            Welcome to your dashboard! Here, you can track lease details,
            payments, submitted documents, and important announcements. Stay
            updated with the latest notices and manage your stall effortlessly.
          </Text>
        </Animated.View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lease Duration</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>Up to: 05/15/24</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rent Due</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>June 15, 2024</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Rent Payment</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>
            {payments.length > 0
              ? `₱${parseFloat(payments[0].payment_amount).toLocaleString()}`
              : "₱0"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Documents")}
        >
          <Text style={styles.cardTitle}>Documents Submitted</Text>
          <View style={styles.divider} />
          <Text style={styles.cardValue}>6 Documents</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Recent Transactions</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Amount</Text>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Status</Text>
          <Text style={styles.headerText}>Type</Text>
        </View>

        <FlatList
          data={payments}
          keyExtractor={(item) => item.payment_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.rowText}>
                ₱{parseFloat(item.payment_amount).toLocaleString()}
              </Text>
              <Text style={styles.rowText}>{item.payment_date}</Text>
              <Text style={styles.rowText}>{item.payment_status}</Text>
              <Text style={styles.rowText}>{item.payment_type}</Text>
            </View>
          )}
        />
      </View>

      {/* Announcements */}
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementTitle}>Announcements</Text>
        <Animated.View
          style={[styles.announcementContent, { opacity: fadeAnim }]}
        >
          <Text style={styles.announcementSubtitle}>
            {currentAnnouncement.title}
          </Text>
          <Text style={styles.announcementText}>
            {currentAnnouncement.text}
          </Text>
        </Animated.View>
        <View style={styles.indicatorContainer}>
          {announcements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentAnnouncementIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (isLargeScreen, isMediumScreen, cardWidth) =>
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
    cardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: isLargeScreen ? 15 : 12,
    },
    card: {
      backgroundColor: "#28a745",
      padding: isLargeScreen ? 20 : 18,
      borderRadius: 8,
      width: cardWidth,
      minHeight: isLargeScreen ? 120 : 110,
      justifyContent: "center",
      marginBottom: isLargeScreen ? 20 : 18,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    cardTitle: {
      fontSize: isLargeScreen ? 16 : 15,
      fontWeight: "bold",
      color: "#ffffff",
    },
    cardValue: {
      fontSize: isLargeScreen ? 18 : 16,
      color: "#ffffff",
      marginTop: 10,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#ffffff",
      marginVertical: 10,
    },
    tableContainer: {
      backgroundColor: "#ffffff",
      padding: isLargeScreen ? 25 : 20,
      borderRadius: 8,
      marginVertical: isLargeScreen ? 25 : 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    tableTitle: {
      fontSize: isLargeScreen ? 22 : 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: "#002181",
    },
    tableHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 2,
      borderBottomColor: "#ddd",
      paddingBottom: 12,
      marginBottom: 8,
    },
    headerText: {
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      fontSize: isLargeScreen ? 16 : 15,
      color: "#002181",
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    rowText: {
      flex: 1,
      textAlign: "center",
      fontSize: isLargeScreen ? 14 : 13,
      color: "#333",
    },
    announcementContent: {
      flexDirection: "column",
      flexWrap: "wrap",
      width: "100%",
    },
    announcementContainer: {
      backgroundColor: "#fffae6",
      padding: isLargeScreen ? 25 : 20,
      borderRadius: 8,
      marginBottom: isLargeScreen ? 30 : 25,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    announcementTitle: {
      fontSize: isLargeScreen ? 22 : 20,
      fontWeight: "bold",
      color: "#002181",
      marginBottom: 12,
    },
    announcementSubtitle: {
      fontSize: isLargeScreen ? 16 : 15,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#333",
    },
    announcementText: {
      fontSize: isLargeScreen ? 14 : 13,
      color: "#333",
      lineHeight: isLargeScreen ? 20 : 18,
      textAlign: "left",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    indicatorContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
    },
    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#ccc",
      marginHorizontal: 5,
    },
    activeIndicator: {
      backgroundColor: "#002181",
    },
  });

export default DashboardScreen;
