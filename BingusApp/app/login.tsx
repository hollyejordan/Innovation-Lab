import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  const router = useRouter();
  const baseURL = "https://4cff-194-81-80-52.ngrok-free.app";

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/GetUser?username=${username}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setError("Could not connect to the server.");
        return;
      }

      const rawResponse = await response.json();

      if (Array.isArray(rawResponse) && rawResponse.length > 0) {
        const user = rawResponse[0];
        if (user.username === username && user.pass_word === password) {
          router.push({
            pathname: "/homepage",
            params: { username },
          });
        } else {
          setError("Invalid username or password. Please try again.");
        }
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={require("../assets/images/eyeslogo-01.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome, please log in.</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            accessibilityLabel="Username input"
          />

          {/* Password Input with Eye Icon Toggle */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password input"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} accessibilityLabel="Toggle password visibility">
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin} accessibilityLabel="Login button">
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/SignUp")} accessibilityLabel="Sign up link">
            <Text style={styles.signUpText}>
              New? <Text style={styles.underline}>Please sign up here.</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgotpassword")} accessibilityLabel="Forgot password link">
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 14,
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
