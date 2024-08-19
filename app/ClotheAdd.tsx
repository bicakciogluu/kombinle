// AddItemsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, FlatList, TouchableOpacity, StyleSheet  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AddItemFromGalleyOrCamera from './AddItemFromGalleryOrCamera';
import AppLoading from 'expo-app-loading';

const ClotheAdd = () => {

  const [selectedAdder, setSelectedAdder] = useState<string>('Gallery');

  const renderContent = () => {
    switch (selectedAdder) {
      case 'Gallery':
        return (
          <AddItemFromGalleyOrCamera />
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

  
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <TouchableOpacity style={styles.statItem} onPress={() => setSelectedAdder('Gallery')}>
          <Text style={styles.statLabel}>Gallery</Text>
          {selectedAdder === 'Gallery' && <View style={styles.underline}></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={() => setSelectedAdder('Database')}>
          <Text style={styles.statLabel}>Database</Text>
          {selectedAdder === 'Database' && <View style={styles.underline}></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={() => setSelectedAdder('Internet')}>
          <Text style={styles.statLabel}>Internet</Text>
          {selectedAdder === 'Internet' && <View style={styles.underline}></View>}
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stats: {
    marginTop:50,
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
    fontSize: 15,
    color: 'black',
  },
  underline: {
    marginTop:10,
    height: 2,
    backgroundColor: '#91DDCF',
    width: '100%',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
},

});

export default ClotheAdd;
