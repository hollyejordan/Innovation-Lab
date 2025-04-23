import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const baseURL = "https://4cff-194-81-80-52.ngrok-free.app "; // Replace with your actual API URL

  const handlePasswordReset = async () => {
    if (!username) {
      setError("Please enter your username.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Fetch the user ID based on the username
      const userResponse = await axios.get(`${baseURL}/GetUser`, {
        params: { username },
      });

      if (!userResponse.data[0]) {
        setError("User not found.");
        return;
      }

      const userID = userResponse.data[0].user_ID;

      // Make an API call to update the user's password
      const response = await axios.get(`${baseURL}/UpdatePassword`, {
        params: {
          pass_word: newPassword,
          user_ID: userID,
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Password successfully reset.");
        setError(null);
        setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Error: Unable to connect to the server.");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>

      {/* Display error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Display success message */}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
      />

      {/* New Password Input */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/login")}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(77, 96, 150)", // Background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
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
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  successText: {
    color: "green",
    marginBottom: 10,
  },
});