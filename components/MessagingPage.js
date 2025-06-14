/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { Alert } from "react-native";

const MessagingPage = ({ route }) => {
  const { sender } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const flatListRef = useRef(null);

  // Load messages from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`messages_${sender}`);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
    loadMessages();
  }, [sender]);

  // Scroll to end after new message
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage("");

    try {
      await AsyncStorage.setItem(
        `messages_${sender}`,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error("Failed to save message", error);
    }
  };

  const clearMessages = async () => {
    try {
      const key = `messages_${sender}`;
      await AsyncStorage.removeItem(key); // delete from storage
      setMessages([]); // clear from state
      // Show success alert
      Alert.alert("Success", "All chats have been cleared.");
    } catch (error) {
      console.error("Error clearing messages: ", error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.headerContainer, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.header, isDarkMode && styles.darkHeaderText]}>
          {sender}
        </Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.iconCard}>
            <Icon name={isDarkMode ? "sun" : "moon"} size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearMessages} style={styles.iconCard}>
            <Icon name="trash-2" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.messageListContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "You" ? styles.myMessage : styles.adminMessage,
                isDarkMode &&
                  (item.sender === "You"
                    ? styles.darkMyMessage
                    : styles.darkAdminMessage),
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isDarkMode && styles.darkMessageText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[styles.timestamp, isDarkMode && styles.darkTimestamp]}
              >
                {item.timestamp}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          inverted
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      <View
        style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}
      >
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Type a message..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#000"}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#002181",
  },
  darkHeader: {
    backgroundColor: "#1f1f1f",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },
  darkHeaderText: {
    color: "#fff",
  },
  iconCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 8,
    minWidth: 36,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageListContainer: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "75%",
    paddingHorizontal: 15,
  },
  myMessage: {
    backgroundColor: "#6200ea",
    alignSelf: "flex-end",
  },
  darkMyMessage: {
    backgroundColor: "#bb86fc",
  },
  adminMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  darkAdminMessage: {
    backgroundColor: "#333",
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  darkMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#ddd",
    marginTop: 5,
    textAlign: "right",
  },
  darkTimestamp: {
    color: "#bbb",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  darkInputContainer: {
    backgroundColor: "#1f1f1f",
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#000",
  },
  darkInput: {
    borderColor: "#555",
    color: "#fff",
  },
  sendButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MessagingPage;
