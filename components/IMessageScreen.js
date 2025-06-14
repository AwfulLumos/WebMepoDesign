/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const messages = [
  {
    id: "1",
    sender: "NCPM Administrator",
    message: "Reminder: Renew your contract by end of the month.",
    time: "1 day ago",
  },
  {
    id: "2",
    sender: "SATELLITE Administrator",
    message: "A new auction is now open for bidding.",
    time: "2 days ago",
  },
];

const IMessageScreen = () => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 15 }}
        >
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerTitle: "I-Message",
      headerStyle: {
        backgroundColor: "#ffffff",
      },
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 18,
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleExpand} style={styles.headerRow}>
          <Text style={styles.header}>I-Message</Text>
          <Text style={styles.toggleIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        <Animated.View
          style={[styles.descriptionContainer, { height: heightInterpolation }]}
        >
          {isExpanded && (
            <Text style={styles.description}>
              Stay informed with important updates from MEPO administrators.
              Check your messages for notifications regarding stall payments,
              renewals, and other announcements.
            </Text>
          )}
        </Animated.View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("MessagingPage", { sender: item.sender })
            }
          >
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContainer: {
    backgroundColor: "#002181",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleIcon: {
    fontSize: 15,
    color: "#ffffff",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },
  descriptionContainer: {
    overflow: "hidden",
  },
  description: {
    fontSize: 14,
    color: "#f5f5f5",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  sender: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  message: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 5,
  },
  time: {
    fontSize: 13,
    color: "#FAFAFA",
    marginTop: 5,
    textAlign: "right",
  },
});

export default IMessageScreen;
