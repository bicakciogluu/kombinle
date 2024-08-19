import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Checkbox from 'expo-checkbox';
import { RootStackParamList } from '@/assets/types/navigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from '@/firebaseConfig';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isSelected, setSelection] = useState(false);
  const [fullName, setFullName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordAgainVisible, setPasswordAgainVisible] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const validatePassword = (password: string) => {
    const minLength = 6;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCaseRegex = /[A-Z]/;

    if (password.length < minLength) {
      setPasswordError('Password must be at least 6 characters long.');
    } else if (!specialCharRegex.test(password)) {
      setPasswordError('Password must contain at least one special character.');
    } else if (!upperCaseRegex.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter.');
    } else {
      setPasswordError('');
    }
  };
  let [fontsLoaded] = useFonts({
    'Montserrat': require('@/assets/fonts/Montserrat-Light.ttf'),
    'MontserratB': require('@/assets/fonts/Montserrat-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('The given text is not in the email format');
    } else {
      setEmailError('');
    }
  };

  const handleNext = async () => {
    if (!fullName || !email || !password || !passwordAgain || !isSelected) {
      Alert.alert("Error", "Please fill in all fields and agree to the terms and conditions.");
      return;
    }
    if (password !== passwordAgain) {
      Alert.alert("Error", "The passwords do not match.");
      return;
    }
    if (emailError || passwordError) {
      Alert.alert("Error", "Please fix the errors before proceeding.");
      return;
    }
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Error", "This email is already registered. Please use a different email.");
        return;
      }

      navigation.navigate('VerifyEmail', { fullName, email, password, name, surname });
    } catch (error) {
      console.error("Error checking email in Firestore:", error);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Started</Text>
      <Text style={styles.subtitle}>by creating a free account.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={fullName}
          onChangeText={setFullName}
        />
        <Icon name="account" size={24} color="#6e6e6e" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Icon name="account" size={24} color="#6e6e6e" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurName}
        />
        <Icon name="account" size={24} color="#6e6e6e" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Valid email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text.toLocaleLowerCase());
            validateEmail(text.toLocaleLowerCase());
          }}
        />
        <TouchableOpacity
          onPressIn={() => setTooltipVisible(true)}
          onPressOut={() => setTooltipVisible(false)}
        >
          <Icon
            name="email"
            size={24}
            color={emailError ? 'red' : '#6e6e6e'}
          />
        </TouchableOpacity>
        {isTooltipVisible && emailError && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{emailError}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Strong Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon name={passwordVisible ? "eye" : "eye-off"} size={24} color="#6e6e6e" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter the Password Again"
          secureTextEntry={!passwordAgainVisible}
          value={passwordAgain}
          onChangeText={setPasswordAgain}
        />
        <TouchableOpacity onPress={() => setPasswordAgainVisible(!passwordAgainVisible)}>
          <Icon name={passwordAgainVisible ? "eye" : "eye-off"} size={24} color="#6e6e6e" />
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => setPasswordTooltipVisible(true)}
          onPressOut={() => setPasswordTooltipVisible(false)}
        >
          <Icon
            name="lock"
            size={24}
            color={password === passwordAgain && password ? 'green' : 'red'}
          />
        </TouchableOpacity>
        {isPasswordTooltipVisible && password != passwordAgain && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{"Passwords do not match."}</Text>
          </View>
        )}
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
          color={isSelected ? '#6C63FF' : undefined}
        />
        <Text style={styles.textWithMargin}>
          By checking the box you agree to our
          <Text style={styles.linkText}> Terms </Text>
          and
          <Text style={styles.linkText}> Conditions</Text>.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleNext()}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textWithMargin: {
    fontSize: 13,
    marginLeft: 10,
  },
  container: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  image: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'MontserratB',
    fontSize: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6e6e6e',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  checkbox: {
    alignSelf: 'center',
  },
  input: {
    color: '#FFFFF',
    fontFamily: 'Montserrat',
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    left: 30,
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  checkboxContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#6e6e6e',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  }
});

export default RegisterScreen;
