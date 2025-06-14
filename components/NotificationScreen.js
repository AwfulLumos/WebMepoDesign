/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationScreen() {
  const { notifications } = useNotifications();

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>There is no notification here.</Text>
      ) : (
        <FlatList
          data={notifications.slice().reverse()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#6200ea",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#ffffff",
  },
  notificationCard: {
    padding: 16,
    backgroundColor: "#28a745",
    marginVertical: 8,
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: "#d4f5dc",
    marginTop: 5,
  },
});
