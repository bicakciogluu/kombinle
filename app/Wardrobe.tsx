import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, NativeEventEmitter, NativeModules, TextInput, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ReviewItemsScreen from './ReviewItemModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from './Models/User';
import axios, { AxiosError } from 'axios';
import { ClotheModel } from './Models/Clothe';
import api from './server/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OutfitModel } from './Models/Outfit';

const storageEmitter = new NativeEventEmitter(NativeModules.StorageModule);

const categories = [
    { id: 1, name: 'Tops', image: require('@/assets/images/kazak.png') },
    { id: 2, name: 'Bottoms', image: require('@/assets/images/pantolon.png') },
    { id: 3, name: 'Footwear', image: require('@/assets/images/ayakkabi.png') },
    { id: 4, name: 'Full body', image: require('@/assets/images/elbise.png') },
    { id: 5, name: 'Outerwear', image: require('@/assets/images/mont.png') }
];

const Wardrobe = () => {
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState('Items');
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState<ClotheModel[]>([]);
    const [buttonVisible, setButtonVisible] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const filteredImages = showFavorites ? images.filter(image => image.vote) : images;
    const itemCount = images.length;
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [user, setUser] = useState<User | null>(null);
    const [outfits, setOutfits] = useState<OutfitModel[]>([]);

    const snapPoints = ['80%'];
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
    async function getOutfits() {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/getOutfit/${user?.id}`);
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
    useEffect(() => {
        fetchUser();

        const handleStorageChange = () => {
            fetchUser();
        };
        getOutfits();

        storageEmitter.addListener('storageChange', handleStorageChange);

        return () => {
            storageEmitter.removeAllListeners('storageChange');
        };
    }, []);
    useEffect(() => {
        if (isModalOpen) {
            bottomSheetModalRef.current?.present();
        }
    }, [isModalOpen]);

    let [fontsLoaded] = useFonts({
        'SpaceMono': require('@/assets/fonts/SpaceMono-Regular.ttf'),
        'SpaceMonoBold': require('@/assets/fonts/SpaceMono-Bold.ttf'),
    });
    useEffect(() => {
        const fetchUserProfile = async () => {
            await getOutfits();

        };

        fetchUserProfile();

        const intervalId = setInterval(() => {
            fetchUserProfile();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [user]);

    const closeModal = () => {
        storageEmitter.emit('storageChange');
        setIsModalOpen(false);
        setImage(null)
        bottomSheetModalRef.current?.close();
    };

    const toggleFavorite = async (id: number, vote: boolean) => {
        setImages(prevList =>
            prevList.map(image =>
                image.id === id ? { ...image, vote: !vote } : image
            )
        );
        try {
            const response = await api.put(`/updateVote/${id}`, {
                vote: (!vote).toString(),
            });

            console.log('Vote updated:', response.data);


        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
            } else {
                console.error('Error:', error);
            }
        }
    };
    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Üzgünüz, bu özellik için galeri izni gerekmektedir.');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setIsModalOpen(true);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Üzgünüz, bu özellik için kamera izni gerekmektedir.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setIsModalOpen(true);
        }
    };

    const renderContent = () => {
        switch (selectedInfo) {
            case 'Items':
                return (
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                                {categories.map(category => (
                                    <View key={category.id} style={styles.category}>
                                        <View style={styles.categoryImageContainer}>
                                            <Image source={category.image} style={styles.categoryImage} />
                                        </View>
                                        <Text style={styles.categoryText}>{category.name}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={styles.searchBar}>
                            <FontAwesome name="search" size={24} color="grey" style={styles.searchIcon} />
                            <TextInput style={styles.searchInput} placeholder="Search" />
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
                                    <AntDesign name="heart" size={20} color={showFavorites ? 'black' : 'grey'} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity>
                                    <Feather name="filter" size={20} color="grey" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView contentContainerStyle={styles.imageGrid}>
                            {filteredImages.map(image => (
                                <View key={image.id} style={styles.imageContainer}>
                                    {image.image_url ? (
                                        <Image source={{ uri: image.image_url }} style={styles.image} resizeMode="contain" />
                                    ) : null}
                                    <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(image.id, image.vote)}>
                                        <AntDesign name="heart" size={16} color={image.vote ? 'black' : 'grey'} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </ScrollView>
                );
            case 'Outfits':
                return <ScrollView contentContainerStyle={styles.postGrid}>
                    {Array.isArray(outfits) && outfits.map(image => (
                        <TouchableOpacity key={image.id} style={styles.postImage}>
                            {image.image_url ? (
                                <Image source={{ uri: image.image_url }} style={styles.postimage} resizeMode="contain" />
                            ) : null}

                        </TouchableOpacity>
                    ))}
                </ScrollView>;;

            default:
                return null;
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}></View>
                        <View style={styles.headerBottom}></View>
                        <View style={styles.profileInfoCard}>
                            <View style={styles.profilePic}></View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{user?.name}{' '}{user?.surname}</Text>
                                <Text style={styles.profileUsername}>@{user?.username}</Text>
                                <View style={styles.stats}>
                                    <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Items'); setButtonVisible(true) }}>
                                        <Text style={[styles.statNumber, selectedInfo === 'Items' && styles.selectedStatNumber]}>{itemCount}</Text>
                                        <Text style={styles.statLabel}>Items</Text>
                                        {selectedInfo === 'Items' && <View style={styles.underline}></View>}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Outfits'); setButtonVisible(false); getOutfits() }}>
                                        <Text style={[styles.statNumber, selectedInfo === 'Outfits' && styles.selectedStatNumber]}>{outfits.length}</Text>
                                        <Text style={styles.statLabel}>Outfits</Text>
                                        {selectedInfo === 'Outfits' && <View style={styles.underline}></View>}
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.secondcontainer}>
                        {renderContent()}
                    </View>
                    {buttonVisible && <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)} >
                        <AntDesign name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                    }
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.modalContainer}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalContent}>
                                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); takePhoto() }}>
                                            <Text style={styles.ModalText}>Take Photo</Text>
                                        </TouchableOpacity>
                                        <View style={styles.separator} />
                                        <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); pickImage() }}>
                                            <Text style={styles.ModalText}>Add From Gallery</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <BottomSheetModal
                    enableContentPanningGesture={false}
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    style={styles.bottomModal}
                >
                    <View style={styles.bottomModalContent}>
                        <ReviewItemsScreen img={image} closeModal={closeModal} />
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    );
}

const styles = StyleSheet.create({

    postGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    postImage: {
        width: '45%',
        aspectRatio: 0.7,
        margin: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    ModalText: {
        fontFamily: 'SpaceMono',
        fontSize: 15,
        color: 'black',
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#e0e0e0',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerTop: {
        backgroundColor: '#91DDCF',
        height: '65%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    headerBottom: {
        backgroundColor: '#f5f5f5',
        height: '35%',
        width: '150%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    secondcontainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10
    },
    header: {
        paddingTop: 40,
        backgroundColor: '#91DDCF',
        padding: 10,

    },
    profileInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        position: 'relative',
    },
    scrollViewContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#f5f5f5',
    },
    profilePic: {
        width: 90,
        height: 90,
        backgroundColor: '#000',
        borderRadius: 40,
        position: 'absolute',
        top: -40,
        left: 20,
    },
    profileInfo: {
        marginTop: 50,
        alignItems: 'center',
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileUsername: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 20,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedStatNumber: {
        color: '#91DDCF',
    },
    statLabel: {
        fontSize: 12,
        color: 'grey',
    },
    underline: {
        height: 2,
        backgroundColor: '#91DDCF',
        width: '100%',
        marginTop: 2,
    },

    categories: {
        flexDirection: 'row',
    },
    category: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    categoryImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    categoryImage: {
        width: 40,
        height: 40,
    },
    categoryText: {
        fontSize: 14,
        marginTop: 5,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    searchIcon: {
        marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        padding: 5,
    },
    iconContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    bottomModal: {
        marginHorizontal: 0,
        paddingHorizontal: 0,
    },
    bottomModalContent: {
        paddingHorizontal: 15,
        marginHorizontal: 0,
    },
    modalButton: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        padding: 5,
    },
    outfitContainer: {
        width: '48%',
        aspectRatio: 0.7,
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        padding: 10,
    },
    postimage: {
        width: '100%',
        aspectRatio: 0.7,
    },
    image: {
        width: '100%',
        height: 150,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    plusButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#91DDCF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },

});

export default Wardrobe;
