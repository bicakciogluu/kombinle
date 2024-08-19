import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Keyboard,
  TouchableWithoutFeedback, ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tag from './Tag';
import axios from 'axios';
import User from '../Models/User';
import UserProfileListItem from '../UserProfileListItem';

const { width } = Dimensions.get('window');

const data = [
  { title: '#FirstDate' },
  { title: '#SummerStyle' },
  { title: '#OfficeWear' },
  { title: '#Vacation' },
  { title: '#Halloween' },
  { title: '#NewYear' },
];

const Explore = () => {
  const [search, setSearch] = useState('');
  const [selectedInfo, setSelectedInfo] = useState<string>('Users');
  const [users, setUsers] = useState<User[] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const exploreUser = async (query: string) => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.post('http://3.76.10.93:5005/exploreUser', {
          q: query
        });

        if (response.status === 200) {
          const users = response.data;
          setUsers(users);
          setNotFound(false);
          return;
        }
      } catch (error) {
        attempts += 1;

        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 404) {
              setUsers([]);
              setNotFound(true);
              return;
            } else {
              console.log('Error:', error.response.data.message);
            }
          } else {
            console.log('An error occurred:', error.message);
          }
        } else {
          console.log('An unexpected error occurred:', error);
        }

        if (attempts >= maxAttempts) {
          return null;
        }
      }
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() !== '') {
      if (selectedInfo == 'Users') {
        exploreUser(search);
      }
      else {

      }
      setSearch('');
    }
  };


  const renderContent = () => {
    switch (selectedInfo) {
      case 'Users':
        return (
          <ScrollView contentContainerStyle={styles.imageGrid}>
            {Array.isArray(users) && users.map((user, index) => (
              <View style={{
                marginBottom: 15, width: '100%',
              }}>
                <UserProfileListItem
                  key={user.id}
                  username={user.username}
                  fullname={user.name + " " + user.surname}
                  userid={user.id}
                />
              </View>
            ))}
            {
              notFound && <Text style={styles.text}>No users found with this query</Text>
            }
          </ScrollView>

        );
      case 'Posts':
        return (
          <Text>Dress Me</Text>
        );

      default:
        return null;
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Feather name="search" size={24} color={'#6e6e6e'} />
            <TextInput
              style={styles.input}
              placeholder="Explore the Best"
              keyboardType="web-search"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchSubmit}
            />
          </View>
        </View>
        <View style={styles.stats}>
          <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Users'); handleSearchSubmit() }}>
            <Text style={styles.statLabel}>Users</Text>
            {selectedInfo === 'Users' && <View style={styles.underline}></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Posts'); handleSearchSubmit() }}>
            <Text style={styles.statLabel}>Posts</Text>
            {selectedInfo === 'Posts' && <View style={styles.underline}></View>}
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        {renderContent()}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  imageGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,

  },
  stats: {
    marginTop: 10,
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
  separator: {
    marginBottom: 10,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  historyScroll: {
    height: 240,
    width: width * 9 / 10,
    zIndex: 10,
  },
  searchContainer: {
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
    alignSelf: 'center',
    position: 'relative'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  focusedContainer: {
    height: 300,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: '#000',
  },
  searchHistoryContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    zIndex: 10,
    width: width * (9 / 10),
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 240,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  historyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  historyItemTextContainer: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 10,
  },
  clearButton: {
    marginTop: 10,
  },
  historyHeader: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  deleteIcon: {
    padding: 10,
  },
  grid: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    width: '45%',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  title: {
    textAlign: 'center',
    padding: 8,
    fontSize: 14,
  },
});

export default Explore;
