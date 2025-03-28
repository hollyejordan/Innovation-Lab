import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { View } from "@/components/Themed"; // Custom Themed View component
import { useRouter } from "expo-router"; // Import Expo Router
import axios from 'axios';
// import {REACT_APP_API_URL} from "@env";


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [data, setData] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // Initialize error as null
  const [shouldFetch, setShouldFetch] = useState(false); // State to trigger API call

  const router = useRouter(); // Use Expo Router for navigation

  let recievedUsername = "";

  const baseURL = CHANGE TO NGROK URL;
  //Ngrok commands
  //ngrok.exe http 3000

  // Trigger API call when `shouldFetch` changes
  useEffect(() => {
    if (shouldFetch) {
      //CHANGE HTTP ADDRESS ON BOOT UP
      axios.get(baseURL+'/GetUser?username='+username)
        .then(response => {
          console.log("API Response:", response.data); // Log the response
          setData(response.data); // Update data state
          console.log(response.data[0]);
        })
        .catch(err => {
          console.error("API Error:", err.message); // Log the error
          setError(err.message); // Update error state
        })
        .finally(() => setShouldFetch(false)); // Reset the trigger
    }
  }, [shouldFetch]);

  // Function to handle login logic
  const handleLogin = async () => { // Async function to handle API call
    if (!username) { // Check if username is empty
      console.log("Please enter a username");
      return;
    }
  
    if (!password) { // Check if password is empty
      console.log("Please enter a password");
      return;
    }
  
    console.log("Logging in with:", username, password);
  
    try {
      //Access the API to get the user data
      const response = await fetch(
        //CHANGE HTTP ADDRESS ON BOOT UP
        `${baseURL}/GetUser?username=${username}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        console.log("Cannot connect to host");
        return;
      }
  
      //Raw response from the API
      const rawResponse = await response.json();
      console.log("Raw Response: ", rawResponse);
  
      //Access each element of the response
      if (Array.isArray(rawResponse) && rawResponse.length > 0) {
        const data = rawResponse[0]; // Access the first element of the array
        console.log("Parsed Data: ", data);
  
        //Assign the recieved username and password to variables
        const retrievedUsername = data.username;
        const retrievedPassword = data.pass_word;
  
        console.log("Retrieved username: ", retrievedUsername);
        console.log("Retrieved password: ", retrievedPassword);
  
        //Authenticate the user
        if (retrievedUsername === username) {
          if (retrievedPassword === password) {
            console.log("Login successful");
            router.push("/homepage"); // Navigate to Homepage
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
    <View style={styles.container}>
      {/* Display error if it exists */}
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}

      {/* Display data if it exists */}
      {data && (
        <Text style={{ color: "white" }}>
          Data: {JSON.stringify(data, null, 2)}
        </Text>
      )}

      {/* Displaying a logo image */}
      <Image source={require("../assets/images/eyeslogo-01.png")} style={styles.logo} />

      {/* Title text prompting the user to log in */}
      <Text style={styles.title}>Welcome, please log in.</Text>

      {/* Username input field */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username} // Controlled input field
        onChangeText={setUsername} // Updates state on text change
        accessibilityLabel="Username input"
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry // Hides password input
        value={password} // Controlled input field
        onChangeText={setPassword} // Updates state on text change
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
    </View>
  );
}

// Defining styles for the login screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full screen height
    alignItems: "center", // Centers content horizontally
    justifyContent: "center", // Centers content vertically
    backgroundColor: "rgb(77 96 150)", // Background color
    padding: 20, // Adds padding around content
  },
  logo: {
    width: 300, // Logo width
    height: 300, // Logo height
    marginBottom: 0, // Adds space below logo
    resizeMode: "contain", // Ensures image maintains aspect ratio
  },
  title: {
    fontSize: 24, // Large font for title
    fontWeight: "bold", // Bold text
    marginBottom: 20, // Space below title
    marginTop: 0,
    color: "#333", // Dark text color
  },
  input: {
    width: "75%", // Input field takes 75% of screen width
    padding: 15, // Inner padding for text input
    marginVertical: 10, // Space above and below input fields
    borderWidth: 1, // Adds border
    borderColor: "#888", // Border color
    borderRadius: 8, // Rounded corners
    backgroundColor: "#fff", // White background
    fontSize: 16, // Text size
  },
  button: {
    width: "75%", // Button width
    backgroundColor: "#161856", // Dark blue button background
    padding: 15, // Padding for button
    alignItems: "center", // Centers text inside button
    borderRadius: 8, // Rounded button corners
    marginTop: 20, // Space above button
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 18, // Text size
    fontWeight: "bold", // Bold text
  },
  signUpText: {
    marginTop: 15, // Space above the sign-up text
    fontSize: 16, // Text size
    color: "black", // Black text color
  },
  underline: {
    textDecorationLine: "underline", // Underlined text for emphasis
    color: "white", // White text color
    fontWeight: "bold", // Bold text
  },
});