/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Image
        source={require("../../assets/back.png")}
        style={styles.backImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 15,
    marginLeft: 15,
    width: 30,
    height: 30,
  },
  backImage: {
    width: 30,
    height: 30,
  },
});
