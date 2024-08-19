import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './index';
import RegisterScreen from './Register';
import LoginScreen from './Login';
import EmailVerification from './EmailVerification'
import WelcomeTabs from './WelcomeTabs'
import { RootStackParamList } from '@/assets/types/navigation';
import ClotheAdd from '@/app/ClotheAdd'
import ProfileScreen from '@/app/ProfileScreen';
import SurveyScreen from './Survey';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={EmailVerification}
          options={{ headerShown: false }}
          initialParams={{
            fullName: 'John Doe',
            email: 'example@example.com',
            password: 'password123'
          }}
        />
        <Stack.Screen name="CreateAccount" component={RegisterScreen}
          options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Welcome"
          component={WelcomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClotheAdd"
          component={ClotheAdd}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          initialParams={{
            userId: -1
          }}
        />
        <Stack.Screen
          name="SurveyScreen"
          component={SurveyScreen}
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
