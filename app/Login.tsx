import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import User from '@/app/Models/User';
import { RootStackParamList } from '@/assets/types/navigation';
import AppLoader from '@/app/AppLoader';

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLogin, setLogin] = useState(false);
    const [isVerified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [need, setneed] = useState(false);

    let [fontsLoaded] = useFonts({
        'Montserrat': require('@/assets/fonts/Montserrat-Light.ttf'),
        'MontserratB': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    useEffect(() => {

        if (isVerified) {
            if (isLogin) {
                setLoading(false);
                if (need) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'SurveyScreen' }],
                        })
                    );
                }
                else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Welcome' }],
                        })
                    );
                }

            }
        }
    }, [isVerified, isLogin]);

    const loginUser = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://3.76.10.93:5005/login', {
                email: email,
                password: password,
            });
            if (response.status === 200 && response.data.message === "login succeeded") {

                const { user_id } = response.data;

                console.log('User logged in successfully:', user_id);

                await AsyncStorage.setItem('user_id', user_id.toString()).then(async () => {
                    await getUserProfile(user_id);
                })



            } else {
                Alert.alert('Error', 'Failed to log in. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            Alert.alert('Error', 'An error occurred during login. Please try again.');
        }
    };

    const getUserProfile = async (userId: number) => {
        try {
            console.log(userId)
            const response = await axios.get(`http://3.76.10.93:5005/user/profile/${userId}`);

            if (response.status === 200) {
                if (response.data != null) {
                    setLogin(true)
                }

                const serverUser = response.data;

                const matchedUser = new User(
                    serverUser.username || '',
                    serverUser.email || '',
                    '',
                    serverUser.name || '',
                    serverUser.surname || ''
                );
                matchedUser.id = serverUser.id;
                matchedUser.clothes = serverUser.clothes || [];
                matchedUser.combinations = serverUser.combinations || [];
                matchedUser.followers = serverUser.followers || [];
                matchedUser.following = serverUser.following || [];
                matchedUser.posts = serverUser.posts || [];
                matchedUser.survey = serverUser.survey || [];

                setneed(serverUser.survey == null)
                await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
            }
        } catch (error: unknown) {
            setLoading(false);

            if (error instanceof AxiosError) {
                if (error.response && error.response.status === 404) {
                    console.log('User not found');
                } else {
                    console.log('An error occurred', error.message);
                }
            } else {
                console.log('An unknown error occurred');
            }
        }
    };

    const handleNext = async (emailOverride?: string, passwordOverride?: string) => {
        const userEmail = emailOverride || email;
        const userPassword = passwordOverride || password;

        if (!userEmail || !userPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await loginUser(userEmail, userPassword);



            const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            const user = userCredential.user;
            await user.reload();

            if (user.emailVerified) {
                setVerified(true)
                await AsyncStorage.setItem('userUid', user.uid);

            } else {
                Alert.alert("Error", "Please verify your email before logging in.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            Alert.alert("Error", "Failed to log in. Please check your email and password.");
        }
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>sign in to access your account</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text.toLocaleLowerCase());
                    }}
                />
                <Icon name="email" size={24} color={'#6e6e6e'} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                    }}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? "eye" : "eye-off"} size={24} color="#6e6e6e" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => handleNext()}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>New member?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.linkText}> Register Now</Text>
                </TouchableOpacity>
            </View>
            {loading && <AppLoader />}
        </View>
    );
};

const styles = StyleSheet.create({
    textWithMargin: {
        fontSize: 13,
        marginLeft: 10,
    },
    container: {
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
        marginTop: 60,
        fontFamily: 'MontserratB',
        fontSize: 32,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 80,
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
        marginTop: 100,
        backgroundColor: '#6C63FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        textAlign: 'center',
        color: '#6e6e6e',
    },
});

export default LoginScreen;
