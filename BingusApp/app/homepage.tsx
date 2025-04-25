import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../themeContext"; // Import dark mode context
import { useESP } from "@/components/ESPContext";

export default function HomeScreen()
{
    const router = useRouter();
    const { username } = useLocalSearchParams();
    const { isDarkMode } = useTheme(); // Use dark mode state

    const [modalVisible, setModalVisible] = useState(true);

    const handleRecordPress = () =>
    {
        console.log("Recording started...");
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "rgb(77, 96, 150)" : "#ffffff" }]}>
            {/* Top Navigation Bar */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? "#161856" : "#e0e0e0" }]}>
                <TouchableOpacity onPress={() => router.push({ pathname: "/settings", params: { username } })}>
                    <Image source={require("../assets/images/settings.png")} style={styles.navImage} />
                </TouchableOpacity>

                <Image source={require("../assets/images/eyeslogo-02.png")} style={styles.navLogo} />

                <TouchableOpacity onPress={() => console.log("Profile pressed")}>
                    <Image source={require("../assets/images/danny.jpg")} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            {/* Pop-up Modal */}
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? "rgb(77, 96, 150)" : "#ffffff" }]}>
                        <Text style={[styles.modalTitle, { color: isDarkMode ? "white" : "black" }]}>
                            Please connect Smart Glasses to your Hotspot...
                        </Text>
                        <Text style={[styles.instructionTitle, { color: isDarkMode ? "white" : "black" }]}>
                            Follow these instructions
                        </Text>
                        <Text style={[styles.instructions, { color: isDarkMode ? "white" : "black" }]}>
                            1. Go to your device’s settings{"\n"}
                            2. Navigate to <Text style={styles.bold}>Personal Hotspot</Text>{"\n"}
                            3. Enable <Text style={styles.bold}>Allow Others to Join</Text>{"\n"}
                            4. Simply follow these steps and you're ready to go!
                        </Text>

                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: isDarkMode ? "#ffffff" : "#4d6096" }]} onPress={() => setModalVisible(false)}>
                            <Text style={[styles.closeButtonText, { color: isDarkMode ? "#4d6096" : "white" }]}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Connection Card */}
            <View style={[styles.card, { backgroundColor: isDarkMode ? "#161856" : "#f0f0f0" }]}>
                <Text style={[styles.connectedText, { color: isDarkMode ? "white" : "black" }]}>Connected to:</Text>

                <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
                    <Text style={[styles.recordText, { color: isDarkMode ? "white" : "black" }]}>Begin Recording</Text>

                    <TouchableOpacity style={[styles.playButton, { backgroundColor: isDarkMode ? "#ffffff" : "#4d6096" }]} onPress={handleRecordPress}>
                        <Text style={[styles.playIcon, { color: isDarkMode ? "#4d6096" : "white" }]}>▶</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles (unchanged except where dark mode is applied dynamically)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 70,
    },
    navbar: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    navImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    navLogo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    card: {
        width: "85%",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    connectedText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
    },
    recordButton: {
        alignItems: "center",
        padding: 10,
    },
    recordText: {
        fontSize: 16,
        color: "white",
        marginBottom: 5,
    },
    playButton: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    playIcon: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4d6096",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "85%",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textDecorationLine: "underline",
        marginBottom: 8,
    },
    instructions: {
        fontSize: 14,
        textAlign: "left",
        marginBottom: 15,
    },
    bold: {
        fontWeight: "bold",
        color: "white",
    },
    closeButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        width: "50%",
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4d6096",
    },
});
