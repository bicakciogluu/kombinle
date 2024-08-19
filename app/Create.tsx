import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import api from './server/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import AppLoader from './AppLoader';

const screenWidth = Dimensions.get('window').width;

const Create = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [userid, setId] = useState<number>();
  const [loading, setLoading] = useState(false);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');

      if (id) {
        setId(Number(id));
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

  const sharePost = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('content', description);
      const fileName = selectedImage?.split('/').pop();
      const fileType = `image/${selectedImage?.split('.').pop()}`;
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage,
          name: fileName,
          type: fileType,
        } as any);
      }

      const response = await api.post(`/sharePost/${userid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Post shared successfully:', response.data);
      Alert.alert('Post shared successfully')
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('File upload failed:', error.response ? error.response.data : error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      Alert.alert('Post could not be shared')

    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const albums = await MediaLibrary.getAlbumsAsync();
      const kombinleAlbum = albums.find(album => album.title === 'Kombinle');
      if (kombinleAlbum) {
        const media = await MediaLibrary.getAssetsAsync({
          album: kombinleAlbum,
          first: 100,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          mediaType: [MediaLibrary.MediaType.photo],
        });

        const imageUris = media.assets.map(asset => asset.uri);
        setImages(imageUris);
        setSelectedImage(imageUris[imageUris.length - 1]);
      } else {
        alert('Kombinle album not found');
      }
    };

    fetchImages();
  }, []);

  if (!selectedImage) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
      >
        <View style={styles.er}>
          <Text style={styles.headerText}>Share Post</Text>
          <TouchableOpacity style={styles.rightButton} onPress={() => { sharePost() }}>
            <FontAwesome name="share" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter the description"
        />
        <View >
          <Text style={styles.header}>My Outfits</Text>
          <ScrollView horizontal style={styles.thumbnailContainer} showsHorizontalScrollIndicator={false}
          >
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(image)}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {loading && <AppLoader />}

    </GestureHandlerRootView >

  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  er: {
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
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
  container: {
    paddingTop: 50,
    padding: 20,
    flex: 1,
    flexDirection: 'column',

    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 0.70,
    resizeMode: 'cover',
  },

  thumbnailContainer: {
    flexDirection: 'row',
    marginBottom: 80
  },
  thumbnail: {
    width: 100,
    height: 150,
    marginRight: 10,
    resizeMode: 'cover',
  },
});

export default Create;
