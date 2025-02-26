import { StyleSheet, TextInput, Button } from 'react-native'; //Importing stylesheet functions for textinput, buttons, etc. 
import { Text, View } from '@/components/Themed'; //Importing themed components for react purposes.
import { useState } from 'react'; //React state for functionality purposes.

export default function TabOneScreen() { //Function used for username and password state.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => { //Handles login state
    console.log('Logging in with:', username, password); //Prints to console
  };

  return ( //Using view and text to link to the stylesheet for the container and text styles.
    <View style={styles.container}> 
      <Text style={styles.title}>LOGIN</Text> {/*page title.*/}

      {/*Placeholders for username inputs.*/}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        accessibilityLabel="Username input"
      />

      {/*Placeholders for password inputs.*/}
      <TextInput 
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password input"
      />

      <Button title="Login" onPress={handleLogin} accessibilityLabel="Login button" /> {/*Button being used for on press interactions with the login.*/}

    </View>
  );
}

const styles = StyleSheet.create({ //Using a const styles for a stylesheet and splitting them into categories.
  container: { //Hosts the backdrop for the login forms
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: { // Styles for the LOGIN title
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
 
  input: { //Input styles for the forms (username,password)
    width: '75%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});