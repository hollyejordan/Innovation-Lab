// Importing necessary components from React Native for building the UI
import { StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

// Importing a themed View component (custom wrapper for consistent styling)
import { View } from "@/components/Themed";

// React hooks to manage state and routing
import { useState } from "react";
import { useRouter } from "expo-router"; // For navigating between screens

// Main functional component for the Sign-Up screen
export default function SignUpScreen() {
  // State variables for the form inputs
  const [username, setUsername] = useState("");         // Stores the entered username
  const [password, setPassword] = useState("");         // Stores the entered password
  const [confirmPassword, setConfirmPassword] = useState(""); // For verifying password match

  const router = useRouter(); // Hook to navigate to other pages (like login)

  // Function that handles sign-up logic when user taps the button
  const handleSignUp = async () => {
    // Check if all fields are filled
    if (!username || !password || !confirmPassword) {
      console.log("All fields are required.");
      return;
    }

    // Check if the two entered passwords match
    if (password !== confirmPassword) {
      console.log("Passwords do not match.");
      return;
    }

    try {
      // First check if the username is already taken (GET request to your backend)
      const checkResponse = await fetch(`http://localhost:3000/GetUser?username=${username}`);
      const existingUsers = await checkResponse.json();

      // If the backend returns any users, the username already exists
      if (existingUsers.length > 0) {
        console.log("Username already exists.");
        return;
      }

      // If username is available, send a POST request to create the user
      const response = await fetch("http://localhost:3000/PostUsername", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pass_word: password, // Make sure your Express API expects "pass_word"
        }),
      });

      const result = await response.text(); // Get response from backend

      // If response is successful, log result and navigate to login screen
      if (response.ok) {
        console.log("User created successfully:", result);
        router.push("/"); // Go back to login/homepage
      } else {
        console.error("Sign-up failed:", result);
      }
    } catch (error) {
      // Catch and log any error that occurs during the request
      console.error("Error during sign-up:", error);
    }
  };

  // UI Layout
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create an Account</Text>

      {/* Username Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        accessibilityLabel="Username input"
      />

      {/* Password Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry // Hides characters for security
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password input"
      />

      {/* Confirm Password Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        accessibilityLabel="Confirm Password input"
      />

      {/* Sign-Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} accessibilityLabel="Sign Up button">
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Link to navigate back to login screen */}
      <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to login">
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.underline}>Log in here.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// StyleSheet to define the look and feel of the UI
const styles = StyleSheet.create({
  container: {
    flex: 1,                            // Takes up full screen height
    alignItems: "center",              // Center children horizontally
    justifyContent: "center",          // Center children vertically
    backgroundColor: "rgb(77 96 150)", // Custom blue background
    padding: 20,                       // Padding around the edges
  },
  title: {
    fontSize: 24,                      // Bigger title text
    fontWeight: "bold",               // Bold title
    marginBottom: 20,                 // Space under the title
    color: "#333",                    // Dark gray text
  },
  input: {
    width: "75%",                     // Input field width
    padding: 15,                      // Space inside the input
    marginVertical: 10,              // Top & bottom spacing between inputs
    borderWidth: 1,                  // Input border thickness
    borderColor: "#888",             // Light gray border
    borderRadius: 8,                 // Rounded corners
    backgroundColor: "#fff",         // White background
    fontSize: 16,                    // Font size inside input
  },
  button: {
    width: "75%",                    // Button width
    backgroundColor: "#161856",     // Navy blue button
    padding: 15,                     // Space inside the button
    alignItems: "center",           // Center text inside button
    borderRadius: 8,                // Rounded corners
    marginTop: 20,                  // Space above the button
  },
  buttonText: {
    color: "#fff",                   // White text
    fontSize: 18,                   // Slightly larger font
    fontWeight: "bold",            // Bold text for emphasis
  },
  signUpText: {
    marginTop: 15,                 // Space above login link
    fontSize: 16,                  // Medium font size
    color: "#333",                 // Gray text
  },
  underline: {
    textDecorationLine: "underline", // Underlined text
    color: "white",                  // White color for contrast
    fontWeight: "bold",             // Bold for emphasis
  },
});
