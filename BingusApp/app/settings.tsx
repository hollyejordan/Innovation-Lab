import React, { useState, useEffect } from "react";
import
    {
        StyleSheet,
        Text,
        View,
        TouchableOpacity,
        Alert,
        Image,
        Modal,
        FlatList,
    } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themeContext";
import { baseURL } from "@/constants/Setver";

export default function SettingsScreen()
{
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const { isDarkMode, setDarkMode } = useTheme();

    const [language, setLanguage] = useState("English");
    const [isLanguageOpen, setLanguageOpen] = useState(false);

    const [textSize, setTextSize] = useState("Medium");
    const [isTextSizeOpen, setTextSizeOpen] = useState(false);

    useEffect(() =>
    {
        const fetchUserPreferences = async () =>
        {
            try
            {
                const response = await fetch(`${baseURL}/GetUserPreferences?username=${username}`);
                const preferences = await response.json();
                const darkModeValue = preferences[0]?.dark_mode === 1;
                setDarkMode(darkModeValue);
                // You could also load language and font size here
            } catch (error)
            {
                console.error("Failed to fetch user preferences:", error);
            }
        };
        fetchUserPreferences();
    }, []);

    const handleToggleDarkMode = async () =>
    {
        const newDarkMode = !isDarkMode;
        setDarkMode(newDarkMode);

        try
        {
            const userRes = await fetch(`${baseURL}/GetUser?username=${username}`);
            const userData = await userRes.json();
            const user_ID = userData[0].user_ID;

            await fetch(`${baseURL}/UpdateDarkMode?dark_mode=${newDarkMode ? 1 : 0}&user_ID=${user_ID}`);
        } catch (error)
        {
            console.error("Failed to update dark mode preference:", error);
        }
    };

    const confirmDelete = () =>
    {
        Alert.alert("Confirm Deletion", "Are you sure you want to delete your data?", [
            { text: "No", style: "cancel" },
            { text: "Yes", style: "destructive", onPress: handleDeletePreferences },
        ]);
    };

    const handleDeletePreferences = async () =>
    {
        try
        {
            const userRes = await fetch(`${baseURL}/GetUser?username=${username}`);
            const userData = await userRes.json();
            const user_ID = userData[0].user_ID;

            const deletePrefRes = await fetch(`${baseURL}/DeleteUserPreferences?user_ID=${user_ID}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (deletePrefRes.ok)
            {
                console.log("Preferences deleted");
                handleDeleteData(user_ID);
            } else
            {
                console.error("Failed to delete preferences");
            }
        } catch (error)
        {
            console.log("Error during delete:", error);
        }
    };

    const handleDeleteData = async (user_ID: number) =>
    {
        try
        {
            const deleteUserRes = await fetch(`${baseURL}/DeleteUserData?user_ID=${user_ID}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (deleteUserRes.ok)
            {
                console.log("User deleted");
                router.push("/");
            } else
            {
                console.error("Failed to delete user data");
            }
        } catch (error)
        {
            console.log("Error during delete:", error);
        }
    };

    const handleSignOut = () =>
    {
        router.push("/login");
    };

    const handleBackHome = () =>
    {
        router.push({ pathname: "/homepage", params: { username } });
    };

    const languageOptions = ["English", "Spanish", "German", "French"];
    const textSizeOptions = ["Small", "Medium", "Large"];

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "rgb(77, 96, 150)" : "#ffffff" }]}>
            {/* Top Navigation Bar */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? "#161856" : "#e0e0e0" }]}>
                <TouchableOpacity onPress={handleBackHome}>
                    <Ionicons name="arrow-back" size={28} color={isDarkMode ? "white" : "black"} />
                </TouchableOpacity>

                <Image source={require("../assets/images/eyeslogo-02.png")} style={styles.navLogo} />
                <TouchableOpacity>
                    <Image source={require("../assets/images/danny.jpg")} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>Settings</Text>

            {/* Dark Mode Toggle */}
            <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? "#161856" : "#4d6096" }]} onPress={handleToggleDarkMode}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                    Switch to {isDarkMode ? "Light" : "Dark"} Mode
                </Text>
            </TouchableOpacity>

            {/* Language Selection */}
            <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? "#161856" : "#4d6096" }]} onPress={() => setLanguageOpen(true)}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Language: {language}</Text>
            </TouchableOpacity>

            {/* Text Size Selection */}
            <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? "#161856" : "#4d6096" }]} onPress={() => setTextSizeOpen(true)}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Text Size: {textSize}</Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? "#161856" : "#4d6096" }]} onPress={() => router.push("/policy")}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Privacy Policy</Text>
            </TouchableOpacity>

            {/* Delete Preferences */}
            <TouchableOpacity style={styles.buttonDelete} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Delete Preferences & Account</Text>
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            {/* Language Modal */}
            <Modal visible={isLanguageOpen} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modal, { backgroundColor: isDarkMode ? "#161856" : "#ffffff" }]}>
                        <Text style={[styles.modalTitle, { color: isDarkMode ? "white" : "black" }]}>Select Language</Text>
                        <FlatList
                            data={languageOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() =>
                                    {
                                        setLanguage(item);
                                        setLanguageOpen(false);
                                    }}
                                >
                                    <Text style={[styles.modalText, { color: isDarkMode ? "white" : "black" }]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Text Size Modal */}
            <Modal visible={isTextSizeOpen} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modal, { backgroundColor: isDarkMode ? "#161856" : "#ffffff" }]}>
                        <Text style={[styles.modalTitle, { color: isDarkMode ? "white" : "black" }]}>Select Text Size</Text>
                        <FlatList
                            data={textSizeOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() =>
                                    {
                                        setTextSize(item);
                                        setTextSizeOpen(false);
                                    }}
                                >
                                    <Text style={[styles.modalText, { color: isDarkMode ? "white" : "black" }]}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 70,
    },
    navbar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
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
        marginBottom: 20,
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
    buttonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#000000aa",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalItem: {
        paddingVertical: 12,
    },
    modalText: {
        fontSize: 18,
    },
});
