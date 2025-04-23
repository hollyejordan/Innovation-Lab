import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ← Native icon support



const baseURL = "https://4cff-194-81-80-52.ngrok-free.app";

export default function SettingsScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams();

  const [language, setLanguage] = useState("English");
  const [isLanguageOpen, setLanguageOpen] = useState(false);

  const [textSize, setTextSize] = useState("Medium");
  const [isTextSizeOpen, setTextSizeOpen] = useState(false);

  const selectLanguage = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setLanguageOpen(false);
  };

  const selectTextSize = (selectedSize: string) => {
    setTextSize(selectedSize);
    setTextSizeOpen(false);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your data?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: handleDeletePreferences },
      ]
    );
  };

  const handleDeletePreferences = async () => {
    try {
      const userGetUser = await fetch(`${baseURL}/GetUser?username=${username}`);
      const userRetrievedUser = await userGetUser.json();
      const user_ID = userRetrievedUser[0].user_ID;

      const deleteResponse = await fetch(`${baseURL}/DeleteUserPreferences?user_ID=${user_ID}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const deleteResult = await deleteResponse.text();
      if (deleteResponse.ok) {
        console.log("User preference delete successful:", deleteResult);
        handleDeleteData(user_ID);
      } else {
        console.error("User preferences deletion error:", deleteResult);
      }
    } catch (error) {
      console.log("Error during delete:", error);
    }
  };

  const handleDeleteData = async (user_ID: number) => {
    try {
      const deleteResponse = await fetch(`${baseURL}/DeleteUserData?user_ID=${user_ID}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const deleteResult = await deleteResponse.text();
      if (deleteResponse.ok) {
        console.log("User deleted successfully:", deleteResult);
        router.push("/");
      } else {
        console.error("User deletion error:", deleteResult);
      }
    } catch (error) {
      console.log("Error during delete:", error);
    }
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  const handleBackHome = () => {
    router.push({
      pathname: "/homepage",
      params: { username },
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBackHome}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* App Logo */}
        <Image source={require("../assets/images/eyeslogo-02.png")} style={styles.navLogo} />

        {/* Profile Icon */}
        <TouchableOpacity onPress={() => console.log("Profile pressed")}>
          <Image source={require("../assets/images/danny.jpg")} style={styles.navImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Settings</Text>

      {/* Language Dropdown */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setLanguageOpen(!isLanguageOpen)}>
        <Text style={styles.optionText}>Language</Text>
        <Text style={styles.dropdownText}>{language} {isLanguageOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {isLanguageOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => selectLanguage("English")}>
            <Text style={styles.dropdownItem}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectLanguage("Spanish")}>
            <Text style={styles.dropdownItem}>Spanish</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectLanguage("French")}>
            <Text style={styles.dropdownItem}>French</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Text Size Dropdown */}
      <TouchableOpacity style={styles.dropdown} onPress={() => setTextSizeOpen(!isTextSizeOpen)}>
        <Text style={styles.optionText}>Text Size</Text>
        <Text style={styles.dropdownText}>{textSize} {isTextSizeOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {isTextSizeOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => selectTextSize("Small")}>
            <Text style={styles.dropdownItem}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectTextSize("Medium")}>
            <Text style={styles.dropdownItem}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectTextSize("Large")}>
            <Text style={styles.dropdownItem}>Large</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transcribe Option */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Transcribe</Text>
      </View>

      <View style={styles.spacer} />

      {/* Review Policies Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/policy")}>
        <Text style={styles.buttonText}>Review Policies</Text>
      </TouchableOpacity>

      {/* Delete Data Button */}
      <TouchableOpacity style={styles.buttonDelete} onPress={confirmDelete}>
        <Text style={styles.buttonText}>Delete Data</Text>
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(21, 43, 66)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#4d6096",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  navImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: "cover",
  },
  navLogo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#4d6096",
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9fb2e1",
  },
  dropdownMenu: {
    width: "100%",
    backgroundColor: "#4d6096",
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownItem: {
    fontSize: 18,
    color: "white",
    paddingVertical: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#9fb2e1",
  },
  optionRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#4d6096",
  },
  optionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  spacer: {
    height: 40,
  },
  button: {
    width: "100%",
    backgroundColor: "#4d6096",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDelete: {
    width: "100%",
    backgroundColor: "#b33a3a",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  signOutButton: {
    width: "100%",
    backgroundColor: "#b33a3a",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 40,
  },
  signOutText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
