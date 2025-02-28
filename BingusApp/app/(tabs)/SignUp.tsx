import { StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { View } from '@/components/Themed'; // Import View component for styling
import { useState } from 'react'; // Import useState for handling input values
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp for navigation typing
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for handling navigation
import { RootStackParamList } from './navigation'; // Import RootStackParamList for navigation types

// Define the navigation prop type for SignUp screen
type NavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  // State variables to store user input
  const [username, setUsername] = useState(''); // Username input
  const [email, setEmail] = useState(''); // Email input
  const [password, setPassword] = useState(''); // Password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm Password input

  // Hook for navigation
  const navigation = useNavigation<NavigationProp>();

  // Function to handle user sign-up (Replace this with actual sign-up logic)
  const handleSignUp = () => {
    console.log('Signing up with:', username, email, password, confirmPassword);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create an Account</Text>

  

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email input"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password input"
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        accessibilityLabel="Confirm Password input"
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} accessibilityLabel="Sign Up button">
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back to Login Link */}
      <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back to login">
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.underline}>Log in here.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the SignUpScreen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take the full height of the screen
    alignItems: 'center', // Centers items horizontally
    justifyContent: 'center', // Centers items vertically
    backgroundColor: 'rgb(77 96 150)', // Background color
    padding: 20, // Padding for better spacing
  },
  title: {
    fontSize: 24, // Large font for title
    fontWeight: 'bold', // Bold font
    marginBottom: 20, // Spacing below the title
    color: '#333', // Dark color for contrast
  },
  input: {
    width: '75%', // Input width
    padding: 15, // Padding inside the input
    marginVertical: 10, // Spacing between inputs
    borderWidth: 1, // Border width
    borderColor: '#888', // Border color
    borderRadius: 8, // Rounded corners
    backgroundColor: '#fff', // White background
    fontSize: 16, // Font size for readability
  },
  button: {
    width: '75%', // Button width
    backgroundColor: '#161856', // Button color
    padding: 15, // Padding inside button
    alignItems: 'center', // Centers text inside button
    borderRadius: 8, // Rounded corners
    marginTop: 20, // Margin above the button
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold text
  },
  signUpText: {
    marginTop: 15, // Margin above the text
    fontSize: 16, // Font size
    color: '#333', // Dark text color
  },
  underline: {
    textDecorationLine: 'underline', // Underline effect
    color: 'white', // Blue color for emphasis
    fontWeight: 'bold', // Bold text
  },
});

