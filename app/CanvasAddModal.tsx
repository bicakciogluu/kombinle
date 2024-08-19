import React, { useEffect, useState } from 'react';
import User from './Models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClotheModel } from './Models/Clothe';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const validTypesMapping: { [key: string]: string[] } = {
    'top': ['T-shirt', 'Shirt', 'Sweatshirt'],
    'lower': ['Pant', 'Short'],
    'shoe': ['Shoe'],
    'outer': ['Jacket'],
};

interface CanvasAddModal {
    clotheType: string;
    closeModal: (imageUri: string, imageType: string, imageid: number) => void;
}

const CanvasAddModal: React.FC<CanvasAddModal> = ({ clotheType, closeModal }) => {
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState<ClotheModel[]>([]);

    const filteredImages = clotheType
        ? images.filter(image => validTypesMapping[clotheType]?.includes(image.type))
        : images;

    const fetchUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData !== null) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setImages(parsedUser?.clothes ?? []);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            <View style={{
                flexDirection: 'row',
            }}>
                {filteredImages.map(image => (
                    <TouchableOpacity
                        key={image.id}
                        style={styles.imageContainer}
                        onPress={() => closeModal(image.image_url, clotheType, image.id)}
                    >
                        {image.image_url ? (
                            <Image source={{ uri: image.image_url }} style={styles.image} resizeMode="contain" />
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    imageContainer: {
        width: 150,
        marginRight: 10,
        alignItems: 'center',
        borderRadius: 10,
        position: 'relative',
        padding: 5,
    },
    image: {
        width: '100%',
        height: 150,
    },
});

export default CanvasAddModal;
