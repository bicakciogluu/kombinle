import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { OutfitModel } from './Models/Outfit';
import axios, { AxiosError } from 'axios';

interface OutfitAddModal {
    closeModal: (imageUri: string) => void;
}


const OutfitAddModal: React.FC<OutfitAddModal> = ({ closeModal }) => {
    const [outfits, setOutfits] = useState<OutfitModel[]>([]);
    async function getOutfits(id: number) {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/getOutfit/${id}`);
            const receivedOutfits = response.data.outfits.map((outfit: any) => {
                return new OutfitModel(
                    outfit.id,
                    outfit.user_id,
                    outfit.image_url,
                );
            });

            setOutfits(receivedOutfits);

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('An error occurred', error.message);
            } else {
                console.log('An unknown error occurred');
            }
        }
    }

    const handleProfilePress = async () => {
        try {
            const id = await AsyncStorage.getItem('user_id');

            if (id) {
                const numericId = Number(id);
                getOutfits(numericId);
            } else {
                console.log('User ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('An error occurred while retrieving the user ID:', error);
        }
    };

    useEffect(() => {
        handleProfilePress();
    }, []);

    return (
        <ScrollView horizontal style={styles.thumbnailContainer} showsHorizontalScrollIndicator={false}
        >
            {outfits.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => closeModal(image.image_url)}>
                    <Image source={{ uri: image.image_url }} style={styles.thumbnail} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({


    thumbnailContainer: {
        flexDirection: 'row',
    },
    thumbnail: {
        width: 100,
        height: 150,
        marginRight: 10,
        resizeMode: 'cover',
    },
});

export default OutfitAddModal;
