import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { View } from "@/components/Themed"; // Custom Themed View component
import { useRouter } from "expo-router"; // Import Expo Router
import axios from 'axios';

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Initialize error as null
  const router = useRouter(); // Use Expo Router for navigation

  const baseURL = "https://6dcf-194-81-80-52.ngrok-free.app";

  const handleLogin = async () => {
    if (!username) {
      console.log("Please enter a username");
      return;
    }

    if (!password) {
      console.log("Please enter a password");
      return;
    }

    console.log("Logging in with:", username, password);

    try {
      const response = await fetch(`${baseURL}/GetUser?username=${username}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log("Cannot connect to host");
        return;
      }

      const rawResponse = await response.json();
      console.log("Raw Response: ", rawResponse);

      if (Array.isArray(rawResponse) && rawResponse.length > 0) {
        const data = rawResponse[0];
        console.log("Parsed Data: ", data);

        const retrievedUsername = data.username;
        const retrievedPassword = data.pass_word;

        console.log("Retrieved username: ", retrievedUsername);
        console.log("Retrieved password: ", retrievedPassword);

        if (retrievedUsername === username) {
          if (retrievedPassword === password) {
            console.log("Login successful");


            router.push({
              pathname:"/homepage",
              params: {username: username}}); // Navigate to Homepage

          } else {
            console.log("Invalid password");
          }
        } else {
          console.log("Invalid username");
        }
      } else {
        console.log("No user found or invalid response format");
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior for iOS and Android
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Display error if it exists */}
          {error && <Text style={{ color: "red" }}>Error: {error}</Text>}

          {/* Displaying a logo image */}
          <Image source={require("../assets/images/eyeslogo-01.png")} style={styles.logo} />

          {/* Title text prompting the user to log in */}
          <Text style={styles.title}>Welcome, please log in.</Text>

          {/* Username input field */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            accessibilityLabel="Username input"
          />

          {/* Password input field */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
          />

          {/* Login button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} accessibilityLabel="Login button">
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Link to navigate to the Sign-Up screen */}
          <TouchableOpacity onPress={() => router.push("/SignUp")} accessibilityLabel="Sign up link">
            <Text style={styles.signUpText}>
              New? <Text style={styles.underline}>Please sign up here.</Text>
            </Text>
          </TouchableOpacity>

          {/* Link to navigate to the Forgot Password screen */}
          <TouchableOpacity onPress={() => router.push("/forgotpassword")} accessibilityLabel="Forgot password link">
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Defining styles for the login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(77 96 150)",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 0,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 0,
    color: "#333",
  },
  input: {
    width: "75%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: "75%",
    backgroundColor: "#161856",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    fontSize: 16,
    color: "black",
  },
  underline: {
    textDecorationLine: "underline",
    color: "white",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 15,
    fontSize: 16,
    color: "white",
    textDecorationLine: "underline",
  },
});