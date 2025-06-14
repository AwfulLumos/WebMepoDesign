/* eslint-disable prettier/prettier */
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function TermsCheckbox({ isChecked, onToggle }) {
  return (
    <View style={styles.termsRow}>
      <TouchableOpacity
        style={[styles.checkbox, isChecked && styles.checkboxChecked]}
        onPress={() => onToggle(!isChecked)}
      >
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.termsText}>
        I have agreed to the terms and conditions
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 3,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2B8000",
    borderColor: "#2B8000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
  },
});
