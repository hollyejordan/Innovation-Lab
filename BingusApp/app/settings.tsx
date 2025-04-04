import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import Expo Router
import { useLocalSearchParams } from "expo-router";

const baseURL = CHANGE TO NGROK URL;

export default function SettingsScreen() {
  const router = useRouter(); // Use Expo Router for navigation

  const { username } = useLocalSearchParams();

  // Dropdown states
  const [language, setLanguage] = useState("English");
  const [isLanguageOpen, setLanguageOpen] = useState(false);

  const [textSize, setTextSize] = useState("Medium");
  const [isTextSizeOpen, setTextSizeOpen] = useState(false);

  // Functions to handle selection
  const selectLanguage = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setLanguageOpen(false);
  };

  const selectTextSize = (selectedSize: string) => {
    setTextSize(selectedSize);
    setTextSizeOpen(false);
  };

  const handleDeletePreferences = async () => {
    const userGetUser = await fetch(`${baseURL}/GetUser?username=${username}`);
    const userRetrievedUser = await userGetUser.json();

    const user_ID = userRetrievedUser[0].user_ID;

    console.log("User ID: ", user_ID);
    
    try {

      const deleteResponse = await fetch(`${baseURL}/DeleteUserPreferences?user_ID=${user_ID}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

    const deleteResult = await deleteResponse.text(); // Get response from backend

      // If response is successful, log result and navigate to login screen
    if (deleteResponse.ok) {
        console.log("User preference delete succcessful:", deleteResult);
        handleDeleteData(user_ID, router); // Call handleDeleteData with user_ID and router
        // handleDeletePreferences(user_ID, router);
    } else {
        console.error("User preferences deletion error:", deleteResult);
    }    

    } catch (error) {
      console.log("Error during delete:", error);
    }
  };

  const handleDeleteData = async (user_ID: number, router: any) => {

    try {
      const deleteResponse = await fetch(`${baseURL}/DeleteUserData?user_ID=${user_ID}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

        const deleteResult = await deleteResponse.text(); // Get response from backend

          // If response is successful, log result and navigate to login screen
        if (deleteResponse.ok) {
            console.log("User delete successfully:", deleteResult);
            router.push("/"); // Go back to login/homepage
        } else {
            console.error("Sign-up failed (preferences):", deleteResult);
        }    
    } catch (error) {
      console.log("Error during delete:", error);
    }
  };

  // Handle Sign Out
  const handleSignOut = () => {
    router.push("/login"); // Navigate to Login
  };

  return (
    <View style={styles.container}>
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

      {/* Spacing for UI clarity */}
      <View style={styles.spacer} />

     {/* Review Policies Button */}
<TouchableOpacity 
  style={styles.button} 
  onPress={() => router.push("/policy")} // Navigate to Policy Page
>
  <Text style={styles.buttonText}>Review Policies</Text>
</TouchableOpacity>


      {/* Delete Data Button */}
      <TouchableOpacity style={styles.buttonDelete} onPress={handleDeletePreferences}>
        <Text style={styles.buttonText}>Delete Data</Text>
      </TouchableOpacity>

      {/* SIGN OUT BUTTON (UPDATED FOR EXPO ROUTER) */}
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
    backgroundColor: "rgb(21, 43, 66)", // Dark background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
    height: 40, // Adds more spacing for structure
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
    marginTop: 40, // Extra spacing for better UI
  },
  signOutText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
