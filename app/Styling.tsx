import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import LayoutTwoColumnsIcon from '@/components/LayoutTwoColumnsIcon';
import LayoutThreeColumnsIcon from '@/components/LayoutThreeColumnsIcon';
import LayoutFourColumnsIcon from '@/components/LayoutFourColumnsIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';


const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.5;
const separatorWidth = screenWidth * 0.25;

type Item = {
    id: number;
    src: any;
    type: string;
};

type RowItems = Item[];

const upperBody: Item[] = [
    { id: 1, src: require('@/assets/images/kazak.png'), type: "upperBody" },
    { id: 2, src: require('@/assets/images/triko.png'), type: "upperBody" },
];

const lowerBody: Item[] = [
    { id: 3, src: require('@/assets/images/pantolon.png'), type: "lowerBody" },
];

const fullBody: Item[] = [
    { id: 4, src: require('@/assets/images/elbise.png'), type: "fullBody" },
];

const outerwear: Item[] = [
    { id: 5, src: require('@/assets/images/mont.png'), type: "outerwear" },
];

const shoes: Item[] = [
    { id: 6, src: require('@/assets/images/ayakkabi.png'), type: "shoes" },

];

const getRows = (numRows: number): RowItems[] => {
    switch (numRows) {
        case 2:
            return [fullBody, shoes];
        case 3:
            return [upperBody, lowerBody, shoes];
        case 4:
            return [outerwear, upperBody, lowerBody, shoes];
        default:
            return [];
    }
};


const Styling = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const flatListRefs = useRef<(FlatList<any> | null)[]>([]);
    const [numRows, setNumRows] = useState<number>(2);
    const [selectedInfo, setSelectedInfo] = useState<string>('Dress Me');
    const [rowItems, setRowItems] = useState<RowItems[]>(getRows(numRows));
    let [fontsLoaded] = useFonts({
        'Montserrat': require('@/assets/fonts/Montserrat-Light.ttf'),
        'MontserratB': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }
    const rows: RowItems[] = getRows(numRows);
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
        const newSelectedIndexes = [...selectedIndexes];
        newSelectedIndexes[rowIndex] = index;
        setSelectedIndexes(newSelectedIndexes);
    };
    const renderRow = (rowItems: RowItems, rowIndex: number) => {
        return (<FlatList
            data={rowItems}
            keyExtractor={(item, index) => `${item.id}-${index}-${rowIndex}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
            snapToAlignment="start"
            snapToInterval={separatorWidth + itemWidth}
            decelerationRate="fast"
            renderItem={({ item, index }) => (

                <View style={[styles.itemContainer, selectedIndex === index && styles.selectedSlot]}>
                    {(() => {
                        let itemSize = 150
                        if (numRows === 2) {
                            if (item.type === 'fullBody') {
                                itemSize = 300;
                            } else {
                                itemSize = 150;
                            }
                        }
                        return (
                            <>
                                <Image source={item.src} style={[styles.itemImage, { width: itemSize, height: itemSize }]} />
                                <TouchableOpacity style={styles.pinIcon}>
                                    <AntDesign name="pushpino" size={24} color="black" />
                                </TouchableOpacity>
                            </>
                        );
                    })()}
                </View>
            )}
            ItemSeparatorComponent={() => <View style={{ width: separatorWidth }} />}

            onEndReached={() => {
                rowItems.push(...rowItems.map(item => ({ ...item, id: item.id + Math.random() }))); // Generate unique IDs for duplicated items
            }}

            onEndReachedThreshold={0.5}
            onScroll={(event) => handleScroll(event, rowIndex)}
            onMomentumScrollEnd={() => handleSnapToItem(selectedIndexes[rowIndex], rowIndex)}

            ref={(ref) => (flatListRefs.current[rowIndex] = ref)}
            initialScrollIndex={0}
            getItemLayout={(data, index) => (
                { length: screenWidth, offset: (separatorWidth + itemWidth) * index, index } // Change this line to use screen width
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
                    <Text>Moodboards</Text>
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
                            <TouchableOpacity onPress={() => setNumRows(2)}>
                                <LayoutTwoColumnsIcon
                                    width={24}
                                    height={24}
                                    stroke={numRows === 2 ? '#91DDCF' : 'black'}
                                    fill={numRows === 2 ? '#91DDCF' : 'none'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setNumRows(3)}>
                                <LayoutThreeColumnsIcon
                                    width={24}
                                    height={24}
                                    stroke={numRows === 3 ? '#91DDCF' : 'black'}
                                    fill={numRows === 3 ? '#91DDCF' : 'none'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setNumRows(4)}>
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
                        <TouchableOpacity style={styles.leftButton}>
                            <Feather name="sliders" size={20} color="white"style={styles.rotatedIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightButton}>
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
                    <Text style={styles.statLabel}>Moodboards</Text>
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
    },
    container: {
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    leftButton: {
        width: 40,
        height: 40,
        left:10,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightButton: {
        width: 40,
        height: 40,
        right:10,
        borderRadius: 25,
        backgroundColor: '#DFFF00', // Neon green color
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Styling;
