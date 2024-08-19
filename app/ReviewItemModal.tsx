import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Tag from './Timeline/Tag';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/app/server/api'

interface ReviewItemsScreenProps {
    img: string | null;
    closeModal: () => void;
}

const ReviewItemsScreen: React.FC<ReviewItemsScreenProps> = ({ img, closeModal }) => {
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [link, setLink] = useState('');
    const [selectedSizeValue, setSelectedSizeValue] = useState<string>('default');
    const [selectedSexValue, setSelectedSexValue] = useState<string>('default');
    const [selectedTypeValue, setSelectedTypeValue] = useState<string>('default');
    const [selectedSeasonValue, setSelectedSeasonValue] = useState<string>('default');
    const [tags, setTags] = useState<{ title: string }[]>([]);
    const [newTag, setNewTag] = useState('');
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    useEffect(() => {
        if (
            brand.trim() !== '' &&
            selectedSizeValue !== 'default' &&
            selectedSexValue !== 'default' &&
            selectedSeasonValue !== 'default'
        ) {
            setIsSaveEnabled(true);
        } else {
            setIsSaveEnabled(false);
        }
    }, [brand, selectedSizeValue, selectedSexValue, selectedSeasonValue]);
    const uploadFile = async (userId: string, formData: FormData) => {
        try {
            const response = await api.post(`/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('Upload successful:', response.data);
                return response.data;
            } else {
                console.log('Upload failed:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
    const handleSave = async () => {
        const id = await AsyncStorage.getItem('user_id');
        const fileUri = img;
        const fileName = img?.split('/').pop();
        const fileType = `image/${img?.split('.').pop()}`;

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName,
            type: fileType,
        } as any);

        formData.append('color', color);
        formData.append('size', selectedSizeValue);
        formData.append('brand', brand);
        formData.append('type', selectedTypeValue);
        formData.append('sex', selectedSexValue);

        try {
            if (id) {
                const result = await uploadFile(id, formData);
                console.log('Uploaded file result:', result);
                closeModal();
            }
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    const handleLeave = () => {
        closeModal();
    };

    const addTag = () => {
        if (newTag.trim()) {
            setTags([...tags, { title: "#" + newTag.trim() }]);
            setNewTag('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.imageContainer}>
                {img ? (
                    <Image source={{ uri: img }} style={styles.selectedImage} />
                ) : (
                    <Text>No Image Selected</Text>
                )}
            </View>
            <Text style={styles.label}>Type</Text>
            <View >
                <Picker
                    selectedValue={selectedTypeValue}
                    onValueChange={(itemValue) => setSelectedTypeValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Type" value="default" />
                    <Picker.Item label="T-shirt" value="T-shirt" />
                    <Picker.Item label="Pant" value="Pant" />
                    <Picker.Item label="Jacket" value="Jacket" />
                    <Picker.Item label="Shirt" value="Shirt" />
                    <Picker.Item label="Shoe" value="Shoe" />
                    <Picker.Item label="Sweatshirt" value="Sweatshirt" />
                    <Picker.Item label="Short" value="Short" />
                </Picker>
            </View>
            <Text style={styles.label}>Tag</Text>
            <View style={styles.grid}>
                {tags.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => removeTag(index)}>
                        <Tag title={item.title} />
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.tagInputContainer}>
                <TextInput
                    style={styles.tagInput}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="eg. Old School, OfficeWear, Date etc."
                />
                <TouchableOpacity style={styles.addButton} onPress={addTag}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Brand</Text>
            <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="Enter brand"
            />
            <Text style={styles.label}>Color</Text>
            <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="Enter only the dominant color"
            />
            <Text style={styles.label}>Size Type</Text>
            <View >
                <Picker
                    selectedValue={selectedSizeValue}
                    onValueChange={(itemValue) => setSelectedSizeValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Size" value="default" />
                    <Picker.Item label="Regular" value="regular" />
                    <Picker.Item label="Oversize" value="oversize" />
                    <Picker.Item label="Slim" value="slim" />
                </Picker>
            </View>
            <Text style={styles.label}>Sex</Text>
            <View >
                <Picker
                    selectedValue={selectedSexValue}
                    onValueChange={(itemValue) => setSelectedSexValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Sex" value="default" />
                    <Picker.Item label="Unisex" value="unisex" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker>
            </View>
            <Text style={styles.label}>Season</Text>
            <View >
                <Picker
                    selectedValue={selectedSeasonValue}
                    onValueChange={(itemValue) => setSelectedSeasonValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Season" value="default" />
                    <Picker.Item label="Summer" value="summer" />
                    <Picker.Item label="Winter" value="winter" />
                    <Picker.Item label="Fall" value="fall" />
                    <Picker.Item label="Spring" value="spring" />
                </Picker>
            </View>
            <Text style={styles.label}>Item Link (Optional)</Text>
            <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="e.g. https://kombinle.com.tr"
            />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        !isSaveEnabled && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={!isSaveEnabled}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.reviewLaterButton}
                    onPress={handleLeave}
                >
                    <Text style={styles.reviewLaterButtonText}>Leave</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        height: 'auto',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    selectedImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },

    placeholder: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 10,
        fontSize: 16,
        color: '#999',
        paddingHorizontal: 10,
    },
    value: {
        paddingLeft: 12,
        fontSize: 15,
        color: '#000',
        marginBottom: 16,
    },
    grid: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 16,
    },
    picker: {
        borderBottomWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        marginBottom: 16,
    },
    tagInputContainer: {
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    tagInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    addButton: {
        width: 40,
        marginLeft: 8,
        backgroundColor: '#d1ec00',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
    },
    saveButton: {
        backgroundColor: '#d1ec00',
        padding: 16,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginRight: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#dde0c8',
        color: '#999',
    },
    saveButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    reviewLaterButton: {
        borderColor: '#d1ec00',
        borderWidth: 2,
        padding: 16,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginLeft: 8,
    },
    reviewLaterButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default ReviewItemsScreen;
