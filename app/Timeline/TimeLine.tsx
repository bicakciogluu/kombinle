import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, BackHandler, ScrollView, NativeEventEmitter, NativeModules } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Post from '../Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../Models/User';
import { PostModel } from '../Models/Post';
import axios, { AxiosError } from 'axios';
import { updateUserProfile } from '../server/api';
export const timelinestorageEmitter = new NativeEventEmitter(NativeModules.StorageModule);


const Timeline = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostModel | null>(null);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [followingposts, setFollowingPosts] = useState<PostModel | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log(userData)
        if (userData !== null) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser)
          setPosts(parsedUser?.posts)
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUser()
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  const fetchFollowingPosts = async (retryCount = 0) => {
    try {
      const response = await axios.get(`http://3.76.10.93:5005/exploreFollowingPosts/${user?.id}`);
      setFollowingPosts(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 404) {
          console.log('User not found');
        } else {
          console.log('An error occurred', error.message);
          if (retryCount < 3) {
            console.log(`Retrying... (${retryCount + 1})`);
            return fetchFollowingPosts(retryCount + 1);
          } else {
            console.log('Maximum retries reached');
          }
        }
      } else {
        console.log('An unknown error occurred');
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount + 1})`);
          return fetchFollowingPosts(retryCount + 1);
        } else {
          console.log('Maximum retries reached');
        }
      }
    }
  };
  const [selectedInfo, setSelectedInfo] = useState<string>('For You');
  const renderContent = () => {
    switch (selectedInfo) {
      case 'For You':
        return (
          <ScrollView contentContainerStyle={styles.imageGrid}>
            {Array.isArray(posts) && posts.map((post, index) => (
              <>
                <Post
                  key={index}
                  post={post}
                  isCommentPanelOpen={activePostId === post.id}
                  setCommentPanelOpen={(isOpen) => setActivePostId(isOpen ? post.id : null)}
                />
                <View style={styles.postseparator} />
              </>
            ))}
          </ScrollView>
        );
      case 'Following':
        return <ScrollView contentContainerStyle={styles.imageGrid}>
          {Array.isArray(followingposts) && followingposts.map((post, index) => (
            <>
              <Post
                key={index}
                post={post}
                isCommentPanelOpen={activePostId === post.id}
                setCommentPanelOpen={(isOpen) => setActivePostId(isOpen ? post.id : null)}
              />
              <View style={styles.postseparator} />
            </>
          ))}
        </ScrollView>;
      case 'Saved':
        return <Text>Saved</Text>;
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <TouchableOpacity style={styles.statItem} onPress={() => setSelectedInfo('For You')}>
          <Text style={styles.statLabel}>For You</Text>
          {selectedInfo === 'For You' && <View style={styles.underline}></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Following'); fetchFollowingPosts() }}>
          <Text style={styles.statLabel}>Following</Text>
          {selectedInfo === 'Following' && <View style={styles.underline}></View>}
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  imageGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 20,
  },
  postseparator: {
    marginVertical: 10,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
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
    marginTop: 5,
    height: 2,
    backgroundColor: '#91DDCF',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },


});


export default Timeline;