
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import Timeline from './TimeLine';
import Explore from './Explore';
import Notifications from './Notifications';
import Saved from './Saved';
import { Feather } from '@expo/vector-icons';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '@/app/Models/User';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Drawer = createDrawerNavigator();


const DrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUser();

    const intervalId = setInterval(() => {
      if (user === null) {
        fetchUser();
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user]);
  const handleProfilePress = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');

      if (id) {
        const numericId = Number(id);
        navigation.navigate('ProfileScreen', { userId: numericId });
      } else {
        console.log('User ID not found in AsyncStorage');
      }
    } catch (error) {
      console.log('An error occurred while retrieving the user ID:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);

      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('user_id');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );

      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.profileImage} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.profileName}>{user?.name}{' '}{user?.surname}</Text>
          <Text style={styles.profileHandle}>@{user?.username}</Text>
          <View style={styles.profileStats}>
            <TouchableOpacity onPress={() => console.log('Following pressed')} style={styles.stat}>
              <Text style={styles.boldText}>{user?.following.length}</Text>
              <Text style={styles.regularText}> Following</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Followers pressed')} style={styles.stat}>
              <Text style={styles.boldText}>{user?.followers.length}</Text>
              <Text style={styles.regularText}> Followers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={20} color={'gray'} style={{ marginRight: 10 }} />
          <Text style={styles.regularText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const SocialMedia = () => {

  return (
    <Drawer.Navigator
      initialRouteName='Timeline'
      drawerContent={(props) => <DrawerContent
        {...props}
      />}
      screenOptions={({ route }) => ({

        drawerIcon: ({ color, size, focused }) => {
          let iconName: string;
          let activeColor: string;

          switch (route.name) {
            case 'Timeline':
              iconName = 'home';
              activeColor = focused ? '#36BA98' : 'gray';
              return <Feather name='home' color={activeColor} size={size} />;
            case 'Explore':
              iconName = 'compass';
              activeColor = focused ? '#EF9C66' : 'gray';
              return <Feather name='compass' color={activeColor} size={size} />;
            case 'Notifications':
              iconName = 'bell';
              activeColor = focused ? '#FF4191' : 'gray';
              return <Feather name='bell' color={activeColor} size={size} />;
            case 'Saved':
              iconName = 'pocket';
              activeColor = focused ? '#91DDCF' : 'gray';
              return <Feather name='pocket' color={activeColor} size={size} />;
            case 'Reach Us':
              iconName = 'send';
              activeColor = focused ? '#3FA2F6' : 'gray';
              return <Feather name='send' color={activeColor} size={size} />;
            default:
              iconName = 'home';
              activeColor = focused ? '#6C63FF' : 'gray';
              return <Feather name='home' color={activeColor} size={size} />;
          }


        },
        drawerLabel: ({ focused }) => {
          let labelColor: string;

          switch (route.name) {
            case 'Timeline':
              labelColor = focused ? '#36BA98' : 'gray';
              break;
            case 'Explore':
              labelColor = focused ? '#EF9C66' : 'gray';
              break;
            case 'Notifications':
              labelColor = focused ? '#FF4191' : 'gray';
              break;
            case 'Saved':
              labelColor = focused ? '#91DDCF' : 'gray';
              break;
            case 'Reach Us':
              labelColor = focused ? '#3FA2F6' : 'gray';
              break;
            default:
              labelColor = focused ? '#6C63FF' : 'gray';
          }

          return (
            <Text style={{ color: labelColor, fontSize: 10 }}>
              {route.name}
            </Text>
          );
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'gray',

      })}
    >
      <Drawer.Screen name="Timeline" component={Timeline} />
      <Drawer.Screen name="Explore" component={Explore} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Saved" component={Saved} />
      <Drawer.Screen name="Reach Us" component={Saved} />

    </Drawer.Navigator>

  );
}


const styles = StyleSheet.create({
  profileContainer: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHandle: {
    marginTop: 3,
    fontSize: 14,
    color: 'gray',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5, // Adjust the spacing as needed
  },
  boldText: {
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold'
  },
  regularText: {
    fontSize: 13,
    color: 'gray',
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default SocialMedia;