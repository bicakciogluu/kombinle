import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '@/app/Models/User';

const api = axios.create({
  baseURL: 'http://3.76.10.93:5005',
});

export const updateUserProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      console.log('User ID not found in local storage');
      return;
    }

    const response = await axios.get(`http://3.76.10.93:5005/user/profile/${userId}`);

    if (response.status === 200) {


      const serverUser = response.data;
      await AsyncStorage.setItem('user_server', JSON.stringify(serverUser));

      const matchedUser = new User(
        serverUser.username || '',
        serverUser.email || '',
        '',
        serverUser.name || '',
        serverUser.surname || ''
      );
      matchedUser.id = serverUser.id;
      matchedUser.clothes = serverUser.clothes || [];
      matchedUser.combinations = serverUser.combinations || [];
      matchedUser.followers = serverUser.followers || [];
      matchedUser.following = serverUser.following || [];
      matchedUser.posts = serverUser.posts || [];
      console.log("deneme")
      await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 404) {
        console.log('User not found');
      } else {
        console.log('An error occurred', error.message);
      }
    } else {
      console.log('An unknown error occurred');
    }
  }
};

api.interceptors.response.use(async (response) => {
  if (response.config.method === 'post' || response.config.method === 'delete') {
    await updateUserProfile();
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;
