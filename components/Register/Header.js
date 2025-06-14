/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/nagastall.png")}
          style={styles.nagaLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerTitle}>Apply For Stall</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3055D7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  nagaLogo: {
    width: 80,
    height: 40,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
