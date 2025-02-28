// Importing necessary components from React Native
import { StyleSheet, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { View } from '@/components/Themed';  // Custom Themed View component
import { useState } from 'react';  // Hook to manage component state
import { StackNavigationProp } from '@react-navigation/stack'; // Navigation prop type for stack navigation
import { useNavigation } from '@react-navigation/native'; // Hook to handle navigation
import { RootStackParamList } from './navigation'; // Importing the navigation type definitions

// Defining the type for navigation to specify valid routes
type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Main functional component for the Login Screen
export default function LoginScreen() {
  // State variables to store user input (username and password)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Hook to enable navigation between screens
  const navigation = useNavigation<NavigationProp>();

  // Function to handle login logic (currently just logging the values)
  const handleLogin = () => {
    console.log('Logging in with:', username, password);
  };

  return (
    <View style={styles.container}>
      {/* Displaying a logo image */}
      <Image source={require('../../assets/images/sassy_logo.jpg')} style={styles.logo} />

      {/* Title text prompting the user to log in */}
      <Text style={styles.title}>Welcome, please log in.</Text>

      {/* Username input field */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}  // Controlled input field
        onChangeText={setUsername}  // Updates state on text change
        accessibilityLabel="Username input"
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry  // Hides password input
        value={password}  // Controlled input field
        onChangeText={setPassword}  // Updates state on text change
        accessibilityLabel="Password input"
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} accessibilityLabel="Login button">
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Link to navigate to the Sign-Up screen */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} accessibilityLabel="Sign up link">
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
    flex: 1,  // Takes full screen height
    alignItems: 'center',  // Centers content horizontally
    justifyContent: 'center',  // Centers content vertically
    backgroundColor: 'rgb(77 96 150)',  // Background color
    padding: 20,  // Adds padding around content
  },
  logo: {
    width: 150,  // Logo width
    height: 150,  // Logo height
    marginBottom: 20,  // Adds space below logo
    resizeMode: 'contain',  // Ensures image maintains aspect ratio
  },
  title: {
    fontSize: 24,  // Large font for title
    fontWeight: 'bold',  // Bold text
    marginBottom: 20,  // Space below title
    color: '#333',  // Dark text color
  },
  input: {
    width: '75%',  // Input field takes 75% of screen width
    padding: 15,  // Inner padding for text input
    marginVertical: 10,  // Space above and below input fields
    borderWidth: 1,  // Adds border
    borderColor: '#888',  // Border color
    borderRadius: 8,  // Rounded corners
    backgroundColor: '#fff',  // White background
    fontSize: 16,  // Text size
  },
  button: {
    width: '75%',  // Button width
    backgroundColor: '#161856',  // Dark blue button background
    padding: 15,  // Padding for button
    alignItems: 'center',  // Centers text inside button
    borderRadius: 8,  // Rounded button corners
    marginTop: 20,  // Space above button
  },
  buttonText: {
    color: '#fff',  // White text color
    fontSize: 18,  // Text size
    fontWeight: 'bold',  // Bold text
  },
  signUpText: {
    marginTop: 15,  // Space above the sign-up text
    fontSize: 16,  // Text size
    color: 'black',  // Black text color
  },
  underline: {
    textDecorationLine: 'underline',  // Underlined text for emphasis
    color: 'white',  // White text color
    fontWeight: 'bold',  // Bold text
  },
});
