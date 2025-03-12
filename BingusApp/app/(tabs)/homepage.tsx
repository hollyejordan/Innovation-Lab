import { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigation';

// Define navigation prop to include Settings
type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>(); // Hook for navigation

  // Pop-up modal state
  const [modalVisible, setModalVisible] = useState(true);

  const handleRecordPress = () => {
    console.log('Recording started...');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        {/* Settings Button - Navigates to Settings Screen */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/images/settings.png')} style={styles.navImage} />
        </TouchableOpacity>

        {/* Home Button */}
        <Image source={require('../../assets/images/sassy_logo.jpg')} style={styles.navImage} />

        {/* Profile Button */}
        <TouchableOpacity onPress={() => console.log('Profile pressed')}>
          <Image source={require('../../assets/images/danny.jpg')} style={styles.navImage} />
        </TouchableOpacity>
      </View>

      {/* Pop-up Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Please connect Smart Glasses to your Hotspot...</Text>
            <Text style={styles.instructionTitle}>Follow these instructions</Text>

            {/* FIXED NESTING ISSUE */}
            <Text style={styles.instructions}>
              1. Go to your device’s settings{"\n"}
              2. Navigate to <Text style={styles.bold}>Personal Hotspot</Text>{"\n"}
              3. Enable <Text style={styles.bold}>Allow Others to Join</Text>{"\n"}
              4. Simply follow these steps and you're ready to go!
            </Text>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Connection Card */}
      <View style={styles.card}>
        <Text style={styles.connectedText}>Connected to:</Text>

        {/* Record Button */}
        <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
          <Text style={styles.recordText}>Begin Recording</Text>
          
          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} onPress={handleRecordPress}>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(21, 43, 66)', // Dark background
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70, // Space for the top navbar
  },
  navbar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#4d6096', // Matching the recording container color
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    width: '85%',
    padding: 20,
    backgroundColor: '#4d6096', // Blue card background
    borderRadius: 12,
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  recordButton: {
    alignItems: 'center',
    padding: 10,
  },
  recordText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  playButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  playIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d6096', // Blue icon color to match theme
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#4d6096', // Blue card background
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: 'white',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: 'white',
    textAlign: 'left',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold', // Ensure "bold" style is defined
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4d6096',
  },
});
