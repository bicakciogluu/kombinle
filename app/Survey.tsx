import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Slider from '@react-native-community/slider';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import api from './server/api';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import surveyImages from '@/assets/survey';

const SurveyScreen = () => {
    const [value, setValue] = useState(0);
    const [id, setid] = useState<string | undefined>(undefined);
    const [surveyRatings, serSurveyRatings] = useState<number[]>(Array(10).fill(0));

    const updateSurveyRating = (index: number, value: number) => {
        const updatedRatings = [...surveyRatings];
        updatedRatings[index] = value / 20;
        console.log(updatedRatings)
        serSurveyRatings(updatedRatings);
    };
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handleProfilePress = async () => {
        try {
            const id = await AsyncStorage.getItem('user_id');

            if (id) {
                setid(id)
                console.log(id)
            } else {
                console.log('User ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('An error occurred while retrieving the user ID:', error);
        }
    };

    useEffect(() => {
        handleProfilePress();
    }, [])
    const submitSurveyRatings = async () => {
        try {
            const response = await api.post('/surveyRatingInsertion', {
                user_id: id,
                0: (surveyRatings[0]),
                1: (surveyRatings[1]),
                2: (surveyRatings[2]),
                3: (surveyRatings[3]),
                4: (surveyRatings[4]),
                5: (surveyRatings[5]),
                6: (surveyRatings[6]),
                7: (surveyRatings[7]),
                8: (surveyRatings[8]),
                9: (surveyRatings[9]),
            });

            console.log(response.data.message);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                })
            );
        } catch (error: unknown) {

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
    return (
        <Swiper style={styles.wrapper} loop={false} dot={<View style={styles.dot} />} activeDot={<View style={styles.activeDot} />}>
            <View style={styles.slide}>
                <Image source={surveyImages.image1} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(0, newValue);
                    }}
                    minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image2} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={2}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(1, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image3} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={3}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(2, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image4} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={4}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(3, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image5} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(4, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image6} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={6}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(5, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image7} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={7}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(6, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image8} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={8}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(7, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image9} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={9}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(8, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />
            </View>
            <View style={styles.slide}>
                <Image source={surveyImages.image10} style={{ width: 250, height: 500 }} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={10}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                        updateSurveyRating(9, newValue);
                    }} minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#b9e4c9"
                    onStartShouldSetResponder={() => true}
                />

            </View>
            <View style={styles.slide}>
                <Image source={require('@/assets/images/2.jpg')} style={styles.image} />
                <Text style={styles.title}>Explore the world easily</Text>
                <Text style={styles.subtitle}>To your desire</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    submitSurveyRatings()

                }}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </Swiper>
    );
}

const styles = StyleSheet.create({
    slider: {
        marginTop: 30,
        width: 300,
        height: 20,
    },
    valueText: {
        fontSize: 18,
        marginBottom: 10,
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
    },
    dot: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 50,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
export default SurveyScreen;
