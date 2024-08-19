import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios, { AxiosError } from 'axios';
import UserModel from '@/app/Models/User';
import AppLoader from '@/app/AppLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

type VerifyEmailScreenRouteProp = RouteProp<RootStackParamList, 'VerifyEmail'>;

type Props = {
  route: VerifyEmailScreenRouteProp;
};
interface User {
  username: string;
  email: string;
  password: string;
}

const EmailVerification: React.FC<Props> = ({ route }) => {
  const { fullName, email, password, name, surname } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [counter, setCounter] = useState<number>(180);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isDataSaved, setIsDataSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userServer: User = new UserModel(fullName, email, password, name, surname);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [id, setid] = useState<number>(-1);

  let [fontsLoaded] = useFonts({
    'Montserrat': require('@/assets/fonts/Montserrat-Light.ttf'),
    'MontserratB': require('@/assets/fonts/Montserrat-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  useEffect(() => {
    if (!isSent) {
      sendVerificationEmail();
      setIsSent(true);
    }
  }, []);

  const checkEmailVerification = async () => {
    const user = auth.currentUser;
    if (user && !isDataSaved) {
      await user.reload();
      if (user.emailVerified) {
        setIsLoading(true)
        try {

          await saveUserEmail(user.uid, email);
          await saveUserServer(userServer);

          setIsDataSaved(true);

          Alert.alert('Success', 'User Data Saved.');
        } catch (error) {
          console.error('Error saving data:', error);
          Alert.alert('Error', 'Failed to save user data.');
        }
      }
    }
  };
  const uploadProfilePic = async (userId: number) => {
    const localAsset = require('@/assets/images/logo.png');

    const uri = FileSystem.documentDirectory + 'logo.png';
    await FileSystem.copyAsync({
      from: localAsset,
      to: uri,
    });

    const formData = new FormData();
    const fileName = 'logo.png';
    const fileType = 'image/png';

    formData.append('file', {
      uri: uri,
      name: fileName,
      type: fileType,
    } as any);

    try {
      const response = await axios.post(`http://3.76.10.93:5005/upload_profile_pic/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('Profile picture uploaded successfully:', response.data.message);
        navigation.navigate('SurveyScreen');

      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error uploading profile picture:', error.response.data.error);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://3.76.10.93:5005/login', {
        email: email,
        password: password,
      });

      if (response.status === 200 && response.data.message === "login succeeded") {
        const { user_id } = response.data;

        console.log('User logged in successfully:', user_id);
        setid(user_id)
        await AsyncStorage.setItem('user_id', user_id.toString());
      } else {
        Alert.alert('Error', 'Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkEmailVerification();
    }, 2000);

    if (isDataSaved) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isDataSaved]);

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    if (isDataSaved) {
      loginUser(email, password);
      uploadProfilePic(id)

    }
  }, [isDataSaved]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isResending) {
      setIsResending(false);
    }
  }, [counter, isResending]);

  const sendVerificationEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      Alert.alert('Success', 'Verification email sent. Please check your email.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already in use. Please use a different email.');
      } else {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to send verification email');
      }
      setIsLoading(false);
    }
  };

  const saveUserEmail = async (uid: string, email: string) => {
    try {
      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving user email:', error);
      Alert.alert('Error', 'Failed to save user email.');
    }
  };

  const saveUserServer = async (userData: User) => {
    try {
      const response = await axios.post('http://3.76.10.93:5005/sign-up', userData);
      console.log('User successfully created:', response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error:', error.message);
        }
      } else if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
    }
  };

  const handleResend = () => {
    setCounter(180);
    setIsResending(true);
    sendVerificationEmail();
  };

  const handleButton = () => {
    signOut(auth).then(() => {
      navigation.navigate('CreateAccount');
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Almost there</Text>
        <Text style={styles.subHeader}>
          Please Verify Your Email <Text style={styles.email}>{email}</Text> for verification.
        </Text>
        <Image
          source={require('@/assets/images/emailVerify.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.verifyButton} onPress={handleButton}>
          <Text style={styles.verifyButtonText}>Go Back</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Didn’t receive any code? <Text style={styles.resendLink} onPress={handleResend}>Resend Again</Text>
        </Text>

        <Text style={styles.timerText}>
          Request new code in {Math.floor(counter / 60).toString().padStart(2, '0')}:{(counter % 60).toString().padStart(2, '0')}s
        </Text>
      </View>
      {isLoading && <AppLoader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontFamily: 'MontserratB',
    fontSize: 24,
  },
  subHeader: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  email: {
    fontWeight: 'bold',
  },
  image: {
    width: 400,
    height: 400,
  },

  verifyButton: {
    backgroundColor: '#4630EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginVertical: 20,
  },
  verifyButtonText: {
    fontFamily: 'MontserratB',
    color: '#fff',
  },
  resendText: {
    fontSize: 14,
    color: '#000',
    marginTop: 10,
  },
  resendLink: {
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default EmailVerification;
