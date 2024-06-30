import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';

const images = [
    { id: 1, src: require('@/assets/images/ayakkabi.png'), favorite: false },
    { id: 2, src: require('@/assets/images/kazak.png'), favorite: false },
    { id: 3, src: require('@/assets/images/mont.png'), favorite: false },
    { id: 4, src: require('@/assets/images/pantolon.png'), favorite: false },
    { id: 5, src: require('@/assets/images/triko.png'), favorite: false },
    { id: 6, src: require('@/assets/images/elbise.png'), favorite: false }
];
const categories = [
    { id: 1, name: 'Tops', image: require('@/assets/images/kazak.png') },
    { id: 2, name: 'Bottoms', image: require('@/assets/images/pantolon.png') },
    { id: 3, name: 'Footwear', image: require('@/assets/images/ayakkabi.png') },
    { id: 4, name: 'Full body', image: require('@/assets/images/elbise.png') },
    { id: 5, name: 'Outerwear', image: require('@/assets/images/mont.png') }
];

const Wardrobe = () => {
    const [imageList, setImageList] = useState(images);
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState('Items');
    const toggleFavorite = (id: number) => {
        setImageList(prevList =>
            prevList.map(image =>
                image.id === id ? { ...image, favorite: !image.favorite } : image
            )
        );
    };

    const filteredImages = showFavorites ? imageList.filter(image => image.favorite) : imageList;
    const itemCount = images.length
    const renderContent = () => {
        switch (selectedInfo) {
            case 'Items':
                return (<ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.categoryScrollView}>
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
                                <Image source={image.src} style={styles.image} resizeMode="contain" />
                                <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(image.id)}>
                                    <AntDesign name="heart" size={16} color={image.favorite ? 'black' : 'grey'} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </ScrollView>);
            case 'Outfits':
                return (
                    <Text>Outfits</Text>
                )
            case 'Saved':
                return (
                    <Text>Saved</Text>
                )
            default:
                return null;
        }


    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}></View>
                <View style={styles.headerBottom}></View>
                <View style={styles.profileInfoCard}>
                    <View style={styles.profilePic}></View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Serhat</Text>
                        <Text style={styles.profileUsername}>@serhatulalem</Text>
                        <View style={styles.stats}>
                            <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Items')}>
                                <Text style={[styles.statNumber, selectedInfo === 'Items' && styles.selectedStatNumber]}>{itemCount}</Text>
                                <Text style={styles.statLabel}>Items</Text>
                                {selectedInfo === 'Items' && <View style={styles.underline}></View>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Outfits')}>
                                <Text style={[styles.statNumber, selectedInfo === 'Outfits' && styles.selectedStatNumber]}>1</Text>
                                <Text style={styles.statLabel}>Outfits</Text>
                                {selectedInfo === 'Outfits' && <View style={styles.underline}></View>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('Saved')}>
                                <Text style={[styles.statNumber, selectedInfo === 'Saved' && styles.selectedStatNumber]}>1</Text>
                                <Text style={styles.statLabel}>Saved</Text>
                                {selectedInfo === 'Saved' && <View style={styles.underline}></View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.secondcontainer}>
                {renderContent()}
            </View>
            <TouchableOpacity style={styles.plusButton}>
                <AntDesign name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 10,
        alignItems: 'center',
        position: 'relative',
    },
    scrollViewContainer: {
        paddingBottom: 10,
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
    categoryScrollView: {
        marginBottom: 10,
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
