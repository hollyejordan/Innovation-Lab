// Import necessary navigation components from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import the screens that will be used in the navigation
import LoginScreen from './login'; 
import SignUpScreen from './SignUp'; 

// Define the types for the stack navigator
// Each screen in the navigator is listed here with any required parameters (none in this case)
export type RootStackParamList = {
  Login: undefined;  // No parameters needed for the Login screen
  SignUp: undefined; // No parameters needed for the Sign-Up screen
};

// Create a stack navigator using the defined parameter list
const Stack = createStackNavigator<RootStackParamList>();

// Main Navigation component that wraps the app with a navigation container
export default function Navigation() {
  return (
    <NavigationContainer> 
      {/* Stack Navigator manages navigation between Login and Sign-Up screens */}
      <Stack.Navigator initialRouteName="Login"> 
        {/* Define the Login screen as part of the stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Define the Sign-Up screen as part of the stack */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
