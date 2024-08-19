import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Post from '../Post';
import { PostModel } from '../Models/Post';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Saved = () => {
  const [posts, setPosts] = useState<PostModel | null>(null);
  const [activePostId, setActivePostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');

        if (id) {
          const numericId = Number(id);
          getAllSavedPosts(numericId)
        } else {
          console.log('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.log('An error occurred while retrieving the user ID:', error);
      }
    };

    fetchUser();
  }, []);
  const getAllSavedPosts = async (userId: number) => {
    try {
      const response = await axios.get(`http://3.76.10.93:5005/getAllSavePosts/${userId}`);

      if (response.status === 200) {
        console.log('Saved posts retrieved successfully:', response.data);
        setPosts(response.data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Error retrieving saved posts:', error.response.data.message);
        } else {
          console.error('Error:', error.message);
        }
      }
    }
  };
  return (
    <View style={styles.container}>
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
    </View>
  );
}
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


  container: {
    flex: 1,
    backgroundColor: 'white',
  },


});
export default Saved;