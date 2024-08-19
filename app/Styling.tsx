import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LayoutThreeColumnsIcon from '@/components/LayoutThreeColumnsIcon';
import LayoutFourColumnsIcon from '@/components/LayoutFourColumnsIcon';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import ImageCanvas from './ImageCanvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from './Models/User';
import { ClotheModel } from './Models/Clothe';
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.5;
const separatorWidth = screenWidth * 0.25;


const validTypesMapping: { [key: string]: string[] } = {
    'top': ['T-shirt', 'Shirt', 'Sweatshirt'],
    'lower': ['Pant', 'Short'],
    'shoe': ['Shoe'],
    'outer': ['Jacket'],
};




const Styling = () => {
    const navigation = useNavigation();

    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const flatListRefs = useRef<(FlatList<any> | null)[]>([]);
    const [numRows, setNumRows] = useState<number>(3);
    const [selectedInfo, setSelectedInfo] = useState<string>('Dress Me');
    const [isScrollable, setIsScrollable] = useState<boolean[]>(Array(numRows).fill(true));
    const [selectedUpper, setSelectedUpper] = useState<{ id: number, image_uri: string } | null>(null);
    const [selectedLower, setSelectedLower] = useState<{ id: number, image_uri: string } | null>(null);
    const [selectedShoes, setSelectedShoes] = useState<{ id: number, image_uri: string } | null>(null);
    const [selectedOuter, setSelectedOuter] = useState<{ id: number, image_uri: string } | null>(null);

    const handlePin = (rowIndex: number) => {
        const newScrollableState = [...isScrollable];
        newScrollableState[rowIndex] = !newScrollableState[rowIndex];
        setIsScrollable(newScrollableState);
    };
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState<ClotheModel[]>([]);

    const upperBody = 'top'
        ? images.filter(image => validTypesMapping['top']?.includes(image.type))
        : images;
    const lowerBody = 'lower'
        ? images.filter(image => validTypesMapping['lower']?.includes(image.type))
        : images;
    const shoes = 'shoe'
        ? images.filter(image => validTypesMapping['shoe']?.includes(image.type))
        : images;
    const outerwear = 'outer'
        ? images.filter(image => validTypesMapping['outer']?.includes(image.type))
        : images;

    const getRows = (numRows: number): ClotheModel[][] => {
        switch (numRows) {
            case 3:
                return [upperBody, lowerBody, shoes];
            case 4:
                return [outerwear, upperBody, lowerBody, shoes];
            default:
                return [];
        }
    };
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
    let [fontsLoaded] = useFonts({
        'Montserrat': require('@/assets/fonts/Montserrat-Light.ttf'),
        'MontserratB': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }
    const rows: ClotheModel[][] = getRows(numRows);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>(Array(rows.length).fill(1));

    const handleScroll = (event: any, rowIndex: number) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (itemWidth + separatorWidth));
        const newSelectedIndexes = [...selectedIndexes];
        newSelectedIndexes[rowIndex] = index;
        setSelectedIndexes(newSelectedIndexes);
    };

    const handleSnapToItem = (index: number, rowIndex: number) => {
        flatListRefs.current[rowIndex]?.scrollToIndex({ animated: true, index });
        const selectedItem = rows[rowIndex][index];

        if (selectedItem) {
            const newSelectedIndexes = [...selectedIndexes];
            newSelectedIndexes[rowIndex] = index;
            setSelectedIndexes(newSelectedIndexes);

            const selectedData = { id: selectedItem.id, image_uri: selectedItem.image_url };

            switch (rowIndex) {
                case 0:
                    setSelectedUpper(selectedData);
                    break;
                case 1:
                    setSelectedLower(selectedData);
                    break;
                case 2:
                    setSelectedShoes(selectedData);
                    break;
                case 3:
                    setSelectedOuter(selectedData);
                    break;
                default:
                    break;
            }
        }
    };
    const renderRow = (rowItems: ClotheModel[], rowIndex: number) => {
        return (<FlatList
            data={rowItems}
            keyExtractor={(item, index) => `${item.id}-${index}-${rowIndex}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
            snapToAlignment="start"
            scrollEnabled={rowItems.length > 0 && isScrollable[rowIndex]}
            snapToInterval={separatorWidth + itemWidth}
            decelerationRate="fast"
            renderItem={({ item, index }) => (
                <View style={[styles.itemContainer, selectedIndex === index && styles.selectedSlot]}>
                    {(() => {
                        let itemSize = 150;
                        return (
                            <>
                                {item.image_url ? (
                                    <Image
                                        source={{ uri: item.image_url }}
                                        style={[styles.itemImage, { width: itemSize, height: itemSize }]}
                                    />
                                ) : null}
                                <TouchableOpacity style={styles.pinIcon} onPress={() => handlePin(rowIndex)}>
                                    <AntDesign name={isScrollable[rowIndex] ? "pushpino" : "pushpin"} size={24} color="black" />
                                </TouchableOpacity>
                            </>
                        );
                    })()}
                </View>
            )}
            ListEmptyComponent={() => (
                <View style={{ paddingLeft: 20 }}>
                    {(() => {
                        let itemSize = 150;
                        return (
                            <View style={[styles.itemContainer, { width: itemSize, height: itemSize, justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity onPress={() => {/*Will be added*/ }}>
                                    <AntDesign name="pluscircleo" size={itemSize / 2} color="gray" />
                                </TouchableOpacity>
                            </View>
                        );
                    })()}
                </View>
            )}
            ItemSeparatorComponent={() => <View style={{ width: separatorWidth }} />}
            onScroll={(event) => handleScroll(event, rowIndex)}
            onMomentumScrollEnd={() => handleSnapToItem(selectedIndexes[rowIndex], rowIndex)}
            ref={(ref) => (flatListRefs.current[rowIndex] = ref)}
            initialScrollIndex={0}
            getItemLayout={(data, index) => (
                { length: screenWidth, offset: (separatorWidth + itemWidth) * index, index }
            )}
        />);
    }
    const renderContent = () => {
        switch (selectedInfo) {
            case 'Styling':
                return (
                    <FlatList

                        data={rows}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderRow(item, index)}
                        showsVerticalScrollIndicator={false}
                    />

                );
            case 'Dress Me':
                return (
                    <Text>Dress Me</Text>
                );
            case 'Moodboards':
                return (
                    <ImageCanvas />
                );
            case 'Moodboardswith':
                return (
                    <ImageCanvas initialUpperBody={selectedUpper}
                        initialLowerBody={selectedLower}
                        initialShoes={selectedShoes}
                        initialouterwear={selectedOuter}
                        initnumber={numRows} />
                );
            default:
                return null;
        }
    };
    const renderBar = () => {
        switch (selectedInfo) {
            case 'Styling':
                return (
                    <View>
                        <View style={styles.rowSelector}>

                            <TouchableOpacity onPress={() => { setNumRows(3); setIsScrollable(Array(isScrollable.length).fill(true)); setSelectedLower(null); setSelectedOuter(null); setSelectedShoes(null); setSelectedUpper(null) }}>
                                <LayoutThreeColumnsIcon
                                    width={24}
                                    height={24}
                                    stroke={numRows === 3 ? '#91DDCF' : 'black'}
                                    fill={numRows === 3 ? '#91DDCF' : 'none'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setNumRows(4); setIsScrollable(Array(isScrollable.length).fill(true)); setSelectedLower(null); setSelectedOuter(null); setSelectedShoes(null); setSelectedUpper(null) }}>
                                <LayoutFourColumnsIcon
                                    width={24}
                                    height={24}
                                    stroke={numRows === 4 ? '#91DDCF' : 'black'}
                                    fill={numRows === 4 ? '#91DDCF' : 'none'}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                );

            default:
                return null;
        }
    };
    const renderEr = () => {
        switch (selectedInfo) {
            case 'Styling':
                return (
                    <View style={styles.er}>
                        <TouchableOpacity style={styles.rightButton} onPress={() => { setSelectedInfo('Moodboardswith') }}>
                            <AntDesign name="arrowright" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.stats}>
                <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Styling')}>
                    <Text style={styles.statLabel}>Styling</Text>
                    {selectedInfo === 'Styling' && <View style={styles.underline}></View>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Dress Me')}>
                    <Text style={styles.statLabel}>Dress Me</Text>
                    {selectedInfo === 'Dress Me' && <View style={styles.underline}></View>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Moodboards')}>
                    <Text style={styles.statLabel}>Canvas</Text>
                    {selectedInfo === 'Moodboards' && <View style={styles.underline}></View>}
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            {renderEr()}
            {renderContent()}
            {renderBar()}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: separatorWidth,
    },
    stats: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    statItem: {
        borderBottomColor: '#000',
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
    },
    statLabel: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        color: 'black',
    },
    underline: {
        height: 2,
        backgroundColor: '#91DDCF',
        width: '100%',
        marginTop: 5,
    },
    container: {
        paddingTop: 50,
        flex: 1,
        backgroundColor: 'white',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 18,
        color: 'black',
    },
    selectedTabText: {
        color: '#91DDCF',
        fontWeight: 'bold',
    },
    rowItem: {
        flexDirection: 'row',
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {

        width: itemWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSlot: {
        borderColor: 'orange',
        width: itemWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {

        marginTop: 20
    },
    pinIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    rotatedIcon: {
        transform: [{ rotate: '90deg' }],
    },
    rowSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
    },

    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    er: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    rightButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginLeft: 'auto',
        backgroundColor: '#DFFF00',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default Styling;
