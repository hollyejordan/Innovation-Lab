import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import Expo Router

export default function PrivacyPolicyScreen() {
  const router = useRouter(); // Initialize router

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Settings</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Data & Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last Updated: March 2025</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.sectionText}>
        This Privacy Policy outlines how we collect, use, store, and protect your personal data while using our app. 
        Your privacy is important to us, and we comply with applicable laws, including **GDPR** (for users in the EU/UK) and **COPPA** (for children’s data protection).
      </Text>

      <Text style={styles.sectionTitle}>2. Data Collection & Processing</Text>
      <Text style={styles.sectionText}>
        We only collect and process data when it is legally justified. This includes:
      </Text>
      <Text style={styles.bulletPoint}>• Explicit user consent before any audio recording.</Text>
      <Text style={styles.bulletPoint}>• Ensuring consent is **freely given, specific, informed, and unambiguous**.</Text>
      <Text style={styles.bulletPoint}>• Collecting the **minimum data necessary** to provide our service.</Text>

      <Text style={styles.sectionTitle}>3. User Rights & Transparency</Text>
      <Text style={styles.sectionText}>
        Users have full control over their personal data. You have the right to:
      </Text>
      <Text style={styles.bulletPoint}>• Access and review the data we store about you.</Text>
      <Text style={styles.bulletPoint}>• Request deletion of your data at any time.</Text>
      <Text style={styles.bulletPoint}>• Withdraw consent for data processing.</Text>

      <Text style={styles.sectionTitle}>4. Data Security Measures</Text>
      <Text style={styles.sectionText}>
        We implement industry-standard security protocols, including:
      </Text>
      <Text style={styles.bulletPoint}>• **Encryption** (AES-256) for stored and transmitted data.</Text>
      <Text style={styles.bulletPoint}>• **Access control**, ensuring only authorized users can access their own data.</Text>
      <Text style={styles.bulletPoint}>• **Regular security audits & penetration testing** to identify vulnerabilities.</Text>

      <Text style={styles.sectionTitle}>5. Ethical & Transparent Design</Text>
      <Text style={styles.sectionText}>
        We believe in ethical design principles and ensure:
      </Text>
      <Text style={styles.bulletPoint}>• Clear visual or verbal indicators when audio recording is active.</Text>
      <Text style={styles.bulletPoint}>• No unnecessary data collection beyond what is needed.</Text>

      <Text style={styles.sectionTitle}>6. Data Retention & Deletion</Text>
      <Text style={styles.sectionText}>
        We only retain data for as long as necessary. Users can:
      </Text>
      <Text style={styles.bulletPoint}>• Delete their transcripts or recordings through the app.</Text>
      <Text style={styles.bulletPoint}>• Request account deletion, which will erase all associated data.</Text>

      <Text style={styles.sectionTitle}>7. Children's Privacy (COPPA Compliance)</Text>
      <Text style={styles.sectionText}>
        If our app captures audio from minors, parental consent is **required** before any data collection. We take extra care to protect children’s data.
      </Text>

      <Text style={styles.sectionTitle}>8. Public Audio Recording Laws</Text>
      <Text style={styles.sectionText}>
        In the **UK**, public audio recordings must comply with GDPR, the **Regulation of Investigatory Powers Act (RIPA) 2000**, and the **Human Rights Act**.
        Consent, transparency, and ethical usage are required when recording in public spaces.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact & Policy Updates</Text>
      <Text style={styles.sectionText}>
        We may update this policy from time to time. If you have any concerns or questions, please contact us at **privacy@[yourapp].com**.
      </Text>

      <Text style={styles.thankYou}>Thank you for trusting us with your data.</Text>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(21, 43, 66)",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    marginBottom: 15,
    padding: 10,
    alignSelf: "flex-start",
    backgroundColor: "#4d6096",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#9fb2e1",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9fb2e1",
    marginTop: 15,
  },
  sectionText: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  bulletPoint: {
    fontSize: 16,
    color: "white",
    marginTop: 2,
    marginLeft: 10,
  },
  thankYou: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9fb2e1",
    textAlign: "center",
    marginTop: 30,
  },
});
