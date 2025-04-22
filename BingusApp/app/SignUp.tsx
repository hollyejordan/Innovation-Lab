import { StyleSheet, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { View } from "@/components/Themed";
import { useState } from "react";
import { useRouter } from "expo-router";

const baseURL = "CHANGE TO NGROK URL";

async function postPreferencesFunct(username: string, router: any) {
  try {
    const userGetUser = await fetch(`${baseURL}/GetUser?username=${username}`);
    const userRetrievedUser = await userGetUser.json();
    const user_ID = userRetrievedUser[0].user_ID;

    const preferenceResponse = await fetch(`${baseURL}/PostPreferences`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_ID: user_ID,
        language_ID: 1,
        font_ID: 1,
        font_size: 10,
        dark_mode: false,
        single_speaker: false,
      }),
    });

    const preferenceResult = await preferenceResponse.text();
    if (preferenceResponse.ok) {
      console.log("Preferences created successfully:", preferenceResult);
      router.push("/");
    } else {
      console.error("Sign-up failed (preferences):", preferenceResult);
    }
  } catch (error) {
    console.log("Error during preferences:", error);
  }
}

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const router = useRouter();

  const validatePassword = (pw: string) => {
    const errors = [];
    if (pw.length < 8) errors.push("8 characters");
    if (!/[A-Z]/.test(pw)) errors.push("an uppercase letter");
    if (!/[a-z]/.test(pw)) errors.push("a lowercase letter");
    if (!/\d/.test(pw)) errors.push("a number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) errors.push("a special character");
    return errors;
  };

  const isUsernameValid = (name: string) => {
    return name.length >= 8 && !/\s/.test(name);
  };

  const isPasswordValid = (pw: string) => {
    return validatePassword(pw).length === 0;
  };

  const handleSignUp = async () => {
    let hasError = false;

    // Username validation
    if (!username || username.length < 8 || /\s/.test(username)) {
      setUsernameError("Username must be at least 8 characters and contain no spaces.");
      hasError = true;
    } else {
      setUsernameError("");
    }

    // Password validation
    const passwordIssues = validatePassword(password);
    if (passwordIssues.length > 0) {
      setPasswordError(`Password must include ${passwordIssues.join(", ")}.`);
      hasError = true;
    } else {
      setPasswordError("");
    }

    // Confirm password check
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmError("");
    }

    if (hasError) return;

    try {
      const checkResponse = await fetch(`${baseURL}/GetUser?username=${username}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        setUsernameError("This username is already in use.");
        return;
      }

      const response = await fetch(baseURL + "/PostUsername", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          pass_word: password,
        }),
      });

      const result = await response.text();

      if (response.ok) {
        console.log("User created successfully:", result);
        postPreferencesFunct(username, router);
      } else {
        Alert.alert("Sign-Up Failed", result);
      }
    } catch (error) {
      Alert.alert("Network Error", "An error occurred during sign-up. Please try again.");
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      {/* Username Input */}
      <TextInput
        style={[
          styles.input,
          usernameError ? styles.inputError : isUsernameValid(username) ? styles.inputSuccess : null,
        ]}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setUsernameError("");
        }}
        accessibilityLabel="Username input"
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={[
          styles.input,
          passwordError ? styles.inputError : isPasswordValid(password) ? styles.inputSuccess : null,
        ]}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
        accessibilityLabel="Password input"
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Confirm Password Input */}
      <TextInput
        style={[
          styles.input,
          confirmError ? styles.inputError : password && confirmPassword && password === confirmPassword
            ? styles.inputSuccess
            : null,
        ]}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmError("");
        }}
        accessibilityLabel="Confirm Password input"
      />
      {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} accessibilityLabel="Sign Up button">
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigation back to login */}
      <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to login">
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.underline}>Log in here.</Text>
        </Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "75%",
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  inputSuccess: {
    borderColor: "green",
  },
  errorText: {
    width: "75%",
    color: "red",
    fontSize: 14,
    marginBottom: 5,
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
    color: "#333",
  },
  underline: {
    textDecorationLine: "underline",
    color: "white",
    fontWeight: "bold",
  },
});
