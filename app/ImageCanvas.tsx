import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Switch, TouchableWithoutFeedback, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CanvasAddModal from './CanvasAddModal';
import { ClotheModel } from './Models/Clothe';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign, Feather } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './server/api';
import { AxiosError } from 'axios';

const colors = [
    '#6874e7',
    '#b8304f',
    '#758E4F',
    '#fa3741',
    '#F26419',
    '#F6AE2D',
    '#DFAEB4',
    '#7A93AC',
    '#33658A',
    '#3d2b56',
    '#42273B',
    '#FFFBE6',
];
const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;

type ClothingCanvasProps = {
    initialUpperBody?: { id: number, image_uri: string } | null;
    initialLowerBody?: { id: number, image_uri: string } | null;
    initialShoes?: { id: number, image_uri: string } | null;
    initialouterwear?: { id: number, image_uri: string } | null;
    initnumber?: number;

};

const ClothingCanvas: React.FC<ClothingCanvasProps> = ({
    initialUpperBody = null,
    initialLowerBody = null,
    initialShoes = null,
    initialouterwear = null,
    initnumber = 3,
}) => {
    const [upperBody, setUpperBody] = useState<string | null>(initialUpperBody?.image_uri ?? null);
    const [lowerBody, setLowerBody] = useState<string | null>(initialLowerBody?.image_uri ?? null);
    const [shoes, setShoes] = useState<string | null>(initialShoes?.image_uri ?? null);
    const [outerwear, setouterwear] = useState<string | null>(initialouterwear?.image_uri ?? null);
    const [upperBodyID, setUpperBodyID] = useState<number>(initialUpperBody?.id ?? 0);
    const [lowerBodyID, setLowerBodyID] = useState<number>(initialLowerBody?.id ?? 0);
    const [shoesID, setShoesID] = useState<number>(initialShoes?.id ?? 0);
    const [outerwearID, setouterwearID] = useState<number>(initialouterwear?.id ?? 0);
    const [number, setNumber] = useState<number>(initnumber);
    const [isOnline, setIsOnline] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [type, setType] = useState<string>('');
    const [color, setColor] = useState<string>('#FEFAE0');
    const [value, setValue] = React.useState(0);
    const sheet = useRef<any>(null);
    const viewShotRef = useRef<ViewShot>(null);
    const [selfid, setselfid] = useState<number>(-1);

    const openColorPicker = () => {
        if (sheet.current) {
            sheet.current.open();
        }
    };
    const closeColorPicker = () => {
        if (sheet.current) {
            sheet.current.close();
        }
    };
    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('user_id');

            if (id) {
                const numericId = Number(id);
                setselfid(numericId)
            } else {
                console.log('User ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('An error occurred while retrieving the user ID:', error);
        }
    };
    useEffect(() => {
        getUserId();
    }, []);
    async function createOutfit(clotheIds: number[], img: string) {
        const fileUri = img;
        const fileName = img?.split('/').pop();
        const fileType = `image/${img?.split('.').pop()}`;

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: fileType,
        } as any);

        const clotheIdsString = clotheIds.join(',');
        formData.append('clothe_ids', clotheIdsString);


        try {
            const response = await api.post(`http://3.76.10.93:5005/create_outfit/${selfid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Outfit created successfully:', response.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log('An error occurred', error.message);
            } else {
                console.log('An unknown error occurred');
            }
        }
    }
    const snapPoints = ['32%'];

    const toggleSwitch = () => {
        setIsOnline(previousState => !previousState);
        setNumber(isOnline ? 3 : 4);
    };
    const closeModal = () => {
        bottomSheetModalRef.current?.close();
    };
    const saveViewShot = async () => {
        if (number == 3 && upperBody != null && lowerBody != null && shoes != null) {
            try {
                const ref = viewShotRef.current;
                if (ref && typeof ref.capture === 'function') {
                    const uri = await ref.capture();

                    if (uri) {
                        const clotheids = [upperBodyID, lowerBodyID, shoesID]
                        createOutfit(clotheids, uri);
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        const album = await MediaLibrary.getAlbumAsync('Kombinle');
                        if (album == null) {
                            await MediaLibrary.createAlbumAsync('Kombinle', asset, false);
                        } else {
                            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                        }
                    }
                } else {
                    console.error('viewShotRef or capture method is not defined');
                }
            } catch (error) {
                console.error('Error saving image to album:', error);
            }
        }
        else if (number == 4 && upperBody != null && lowerBody != null && shoes != null && outerwear != null) {
            try {
                const ref = viewShotRef.current;
                if (ref && typeof ref.capture === 'function') {
                    const uri = await ref.capture();
                    if (uri) {
                        const clotheids = [upperBodyID, lowerBodyID, shoesID, outerwearID]
                        createOutfit(clotheids, uri);
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        const album = await MediaLibrary.getAlbumAsync('Kombinle');
                        if (album == null) {
                            await MediaLibrary.createAlbumAsync('Kombinle', asset, false);
                        } else {
                            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                        }
                    }
                } else {
                    console.error('viewShotRef or capture method is not defined');
                }
            } catch (error) {
                console.error('Error saving image to album:', error);
            }
        }
        else {
            Alert.alert('Try to complete your outfit')
        }
    };


    const handleImageSelect = (imageUri: string, imageType: string, imageid: number) => {
        switch (imageType) {
            case 'top':
                setUpperBody(imageUri);
                setUpperBodyID(imageid);
                break;
            case 'lower':
                setLowerBody(imageUri);
                setLowerBodyID(imageid);
                break;
            case 'shoe':
                setShoes(imageUri);
                setShoesID(imageid);
                break;
            case 'outer':
                setouterwear(imageUri);
                setouterwearID(imageid);
                break;
            default:
                break;
        }
        closeModal();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>

                <View style={{ flex: 1 }} >
                    <TouchableOpacity style={styles.rightButton} onPress={saveViewShot}>
                        <AntDesign name="arrowright" size={20} color="black" />
                    </TouchableOpacity>
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={{ flex: 1 }}>

                        <View style={[styles.container, { backgroundColor: color }]}>

                            <TouchableOpacity
                                style={[styles.imageContainer, styles.upperBody]}
                                onPress={() => {
                                    if (upperBody) {
                                        setUpperBody(null);
                                    } else {
                                        bottomSheetModalRef.current?.present();
                                        setType('top');
                                    }
                                }}
                            >
                                {upperBody ? (
                                    <Image source={{ uri: upperBody }} style={styles.image} />
                                ) : (
                                    <Text style={styles.plusSign}>+</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.imageContainer, styles.lowerBody]}
                                onPress={() => {
                                    if (lowerBody) {
                                        setLowerBody(null);
                                    } else {
                                        bottomSheetModalRef.current?.present();
                                        setType('lower');
                                    }
                                }}
                            >
                                {lowerBody ? (
                                    <Image source={{ uri: lowerBody }} style={styles.image} />
                                ) : (
                                    <Text style={styles.plusSign}>+</Text>
                                )}
                            </TouchableOpacity>
                            {number === 4 && <TouchableOpacity
                                style={[styles.imageContainer, styles.OuterWear]}
                                onPress={() => {
                                    if (outerwear) {
                                        setouterwear(null);
                                    } else {
                                        bottomSheetModalRef.current?.present();
                                        setType('outer');
                                    }
                                }}
                            >
                                {outerwear ? (
                                    <Image source={{ uri: outerwear }} style={styles.image} />
                                ) : (
                                    <Text style={styles.plusSign}>+</Text>
                                )}
                            </TouchableOpacity>}
                            <TouchableOpacity
                                style={[styles.imageContainer, styles.shoes]}
                                onPress={() => {
                                    if (shoes) {
                                        setShoes(null);
                                    } else {
                                        bottomSheetModalRef.current?.present();
                                        setType('shoe');
                                    }
                                }}
                            >
                                {shoes ? (
                                    <Image source={{ uri: shoes }} style={styles.image} />
                                ) : (
                                    <Text style={styles.plusSign}>+</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                    </ViewShot>
                    <TouchableOpacity style={styles.leftButton} onPress={openColorPicker}>
                        <Feather name="sliders" size={20} color="white" style={styles.rotatedIcon} />
                    </TouchableOpacity>
                    <RBSheet
                        customStyles={{ container: styles.colorcontainer }}
                        height={350}
                        openDuration={250}
                        ref={sheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetHeaderTitle}>Select Canvas Color</Text>
                        </View>
                        <View style={styles.switchContaimer}>
                            <Text style={{ marginRight: 20 }}>Enable Outer Wear</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isOnline ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isOnline}
                            />
                        </View>
                        <View style={styles.sheetBody}>

                            <View style={styles.group}>
                                {colors.map((item, index) => {
                                    const isActive = value === index;
                                    return (
                                        <View key={item}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    setValue(index);
                                                }}>
                                                <View
                                                    style={[
                                                        styles.circle,
                                                        isActive && { borderColor: item },
                                                    ]}>
                                                    <View
                                                        style={[styles.circleInside, { backgroundColor: item }]}
                                                    />
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    );
                                })}
                            </View>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => {
                                    setColor(colors[value])
                                    closeColorPicker()
                                }}>
                                <Text style={styles.btnText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </RBSheet>

                </View>

                <BottomSheetModal
                    enableContentPanningGesture={false}
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    style={[styles.bottomModal, { backgroundColor: '#FEFAE0' }]}
                >
                    <View style={styles.bottomModalContent}>
                        <CanvasAddModal clotheType={type} closeModal={handleImageSelect} />
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    switchContaimer: {
        alignItems: 'center',
        paddingLeft: 30,
        flexDirection: 'row'
    },
    upperBody: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: '50%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -25 }],
        zIndex: 10,
    },
    lowerBody: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '50%',
        height: '50%',
    },
    rotatedIcon: {
        transform: [{ rotate: '90deg' }],
    },
    OuterWear: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '50%',
    },
    shoes: {
        position: 'absolute',
        bottom: 60,
        right: 0,
        width: '50%',
        height: '30%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    plusSign: {
        fontSize: 48,
        color: '#888',
    },
    rightButton: {
        width: 40,
        height: 40,
        right: 10,
        borderRadius: 25,
        marginLeft: 'auto',
        backgroundColor: '#DFFF00',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        zIndex: 10,
    },
    bottomModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 0,
        paddingHorizontal: 0,
    },
    bottomModalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginHorizontal: 0,

    },
    colorcontainer: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    /** Placeholder */
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 24,
        backgroundColor: 'transparent',
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    sheetHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    sheetHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    sheetBody: {
        padding: 24,
    },


    /** Circle */
    circle: {
        width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: CIRCLE_RING_SIZE,
        borderColor: 'transparent',
        marginRight: 8,
        marginBottom: 12,
    },
    circleInside: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 9999,
        position: 'absolute',
        top: CIRCLE_RING_SIZE,
        left: CIRCLE_RING_SIZE,
    },
    /** Button */
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        padding: 14,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#000',
        marginBottom: 12,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default ClothingCanvas;
