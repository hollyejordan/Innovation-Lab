import React, { useEffect, useState } from "react";
import
{
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
import { useESP } from "@/components/ESPContext";
import { baseURL } from "@/constants/Setver";

export default function LoginScreen()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    // Secure login request using POST
    const handleLogin = async () =>
    {
        setError("");

        if (!username || !password)
        {
            setError("Please enter both username and password.");
            return;
        }

        try
        {
            const response = await fetch(`${baseURL}/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success)
            {
                // ✅ Login success: go to homepage and pass username
                router.push({
                    pathname: "/homepage",
                    params: { username },
                });
            } else
            {
                // ❌ Login failed: show reason
                setError(data.message || "Invalid username or password.");
            }
        } catch (err: any)
        {
            console.error("Login Error:", err);
            setError("Network error: " + (err.message || err));
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    {/* Logo */}
                    <Image source={require("../assets/images/eyeslogo-01.png")} style={styles.logo} />
                    <Text style={styles.title}>Welcome, please log in.</Text>

                    {/* Username input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#666"
                        value={username}
                        onChangeText={setUsername}
                        accessibilityLabel="Username input"
                    />

                    {/* Password input with eye icon toggle */}
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

                    {/* Error message */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Login button */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin} accessibilityLabel="Login button">
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    {/* Sign up and forgot password links */}
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
