/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function ConnectionBanner({ isConnected }) {
  if (isConnected) return null;

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        No internet connection. Please connect to register.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#f8d7da",
    padding: 10,
    alignItems: "center",
  },
  offlineText: {
    color: "#721c24",
    fontWeight: "500",
  },
});
