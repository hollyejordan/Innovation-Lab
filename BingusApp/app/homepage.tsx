// React Native and React imports
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, ScrollView } from "react-native";

// Expo Router and custom theme context
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../themeContext";

// Custom ESP WebSocket context
import { useESP } from "@/components/ESPContext";

// Type for each transcribed message
type Message = {
    text: string;
    timestamp: string;
};

export default function HomeScreen()
{
    // Router allows navigation between screens
    const router = useRouter();

    // Extract username from URL parameters
    const { username } = useLocalSearchParams();

    // Dark mode toggle from shared theme context
    const { isDarkMode } = useTheme();

    // Whether to show the instructions popup initially
    const [modalVisible, setModalVisible] = useState(true);

    // List of transcribed messages (each with text + timestamp)
    const [messages, setMessages] = useState<Message[]>([]);

    // UI button state for recording
    const [isRecording, setIsRecording] = useState(false);

    // useRef version of recording state for use inside async functions
    const isRecordingRef = useRef(false);

    // Access our ESP connection and control functions
    const esp = useESP();

    // Called every time new text is received from ESP32
    const on_got_text = (p_text: string) =>
    {
        // Ignore input if not recording
        if (!isRecordingRef.current) return;

        // Get current timestamp
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add new message at top of list
        setMessages(prev => [{ text: p_text, timestamp }, ...prev]);

        // Print to console (for development/debugging)
        console.log("Transcription:", p_text);
    };

    // Run on first render: subscribe to transcription events
    useEffect(() =>
    {
        console.log("Registered");
        esp.register("transcription", on_got_text);

        // Cleanup listener on unmount
        return () =>
        {
            esp.unregister("transcription", on_got_text);
        };
    }, []);

    // Triggered when record button is pressed
    const handleRecordPress = () =>
    {
        const nextState = !isRecording;

        // Update UI and recording ref
        setIsRecording(nextState);
        isRecordingRef.current = nextState;

        // Tell ESP context to start or stop recording
        esp.set_recording(nextState);

        // Debug log
        console.log(nextState ? "Recording started..." : "Recording stopped.");
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "rgb(77, 96, 150)" : "#ffffff" }]}>
            {/* Top navigation bar */}
            <View style={[styles.navbar, { backgroundColor: isDarkMode ? "#161856" : "#e0e0e0" }]}>
                <TouchableOpacity onPress={() => router.push({ pathname: "/settings", params: { username } })}>
                    <Image source={require("../assets/images/settings.png")} style={styles.navImage} />
                </TouchableOpacity>

                <Image source={require("../assets/images/eyeslogo-02.png")} style={styles.navLogo} />

                <TouchableOpacity onPress={() => console.log("Profile pressed")}>
                    <Image source={require("../assets/images/danny.jpg")} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            {/* Initial "connect to hotspot" modal */}
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
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: isDarkMode ? "#ffffff" : "#4d6096" }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={[styles.closeButtonText, { color: isDarkMode ? "#4d6096" : "white" }]}>Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Card showing status and record button */}
            <View style={[styles.card, { backgroundColor: isDarkMode ? "#161856" : "#f0f0f0" }]}>
                <Text style={[styles.connectedText, { color: isDarkMode ? "white" : "black" }]}>Connected to:</Text>

                {/* Start/stop recording button */}
                <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
                    <Text style={[styles.recordText, { color: isDarkMode ? "white" : "black" }]}>
                        {isRecording ? "Stop Recording" : "Begin Recording"}
                    </Text>
                    <TouchableOpacity style={[styles.playButton, { backgroundColor: isDarkMode ? "#ffffff" : "#4d6096" }]} onPress={handleRecordPress}>
                        <Text style={[styles.playIcon, { color: isDarkMode ? "#4d6096" : "white" }]}>
                            {isRecording ? "■" : "▶"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>
                    {
                        esp.set_time_per_char(100000);
                    }}>
                        <Text>Update</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            {/* Scrollable area showing transcriptions */}
            <View style={styles.scrollWrapper}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {messages.map((msg, index) => (
                        <View
                            key={index}
                            style={[
                                styles.transcriptionBox,
                                {
                                    backgroundColor: isDarkMode ? "#20224d" : "#f7f9fc",
                                    borderColor: isDarkMode ? "#3b3e80" : "#ccc",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.transcriptionText,
                                    { color: isDarkMode ? "white" : "#222" },
                                ]}
                            >
                                {msg.text}
                            </Text>
                            <Text
                                style={[
                                    styles.timestamp,
                                    { color: isDarkMode ? "#aaa" : "#666" },
                                ]}
                            >
                                {msg.timestamp}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

// Styles for layout, UI, and dynamic color themes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
        marginBottom: 10,
    },
    connectedText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    recordButton: {
        alignItems: "center",
        padding: 10,
    },
    recordText: {
        fontSize: 16,
        marginBottom: 5,
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    playIcon: {
        fontSize: 24,
        fontWeight: "bold",
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
    scrollWrapper: {
        width: "100%",
        maxHeight: 300,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 30,
        alignItems: "center",
    },
    transcriptionBox: {
        marginTop: 10,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        width: "100%",
    },
    transcriptionText: {
        fontSize: 16,
        textAlign: "left",
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        textAlign: "right",
    },
});
