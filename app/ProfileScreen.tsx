import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, NativeEventEmitter, NativeModules } from 'react-native';
import { RootStackParamList } from '@/assets/types/navigation';
import { RouteProp } from '@react-navigation/native';
import axios, { AxiosError } from 'axios';
import UserModel from './Models/User';
import { ClotheModel } from './Models/Clothe';
import { PostModel } from './Models/Post';
import User from './Models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import api from './server/api';
import AppLoader from './AppLoader';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreen'>;

type Props = {
    route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<Props> = ({ route }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [pp, setPP] = useState<string>('');
    const [images, setImages] = useState<ClotheModel[]>([]);
    const [user, setUser] = useState<UserModel | null>(null);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [self, setSelf] = useState<boolean>(false);
    const [selfid, setselfid] = useState<number>(-1);
    const [isFollowable, setFollowable] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const storageEmitter = new NativeEventEmitter(NativeModules.StorageModule);

    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('user_id');

            if (id) {
                const numericId = Number(id);
                setselfid(numericId)
                setSelf(route.params.userId == numericId)
            } else {
                console.log('User ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('An error occurred while retrieving the user ID:', error);
        }
    };

    const handleBtn = async () => {
        if (isFollowable) {
            await sendFriendRequest()
        } else {
            await unfollowFriend()
        }

    }
    const unfollowFriend = async () => {
        let attempt = 0;
        const maxAttempts = 2;

        while (attempt < maxAttempts) {
            try {
                const response = await api.delete('http://3.76.10.93:5005/unfollowFriend', {
                    data: {
                        follower_id: selfid,
                        followed_id: route.params.userId,
                    },
                });

                if (response.status === 200) {
                    console.log('Successfully unfollowed');
                    storageEmitter.emit('storageChange');
                    return response.data;
                } else {
                    console.log('Unexpected response status:', response.status);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        console.log('Error:', error.response.data.message);
                    } else {
                        console.log('An error occurred:', error.message);
                    }
                } else {
                    console.log('An unexpected error occurred:', error);
                }
            }
            attempt++;
            if (attempt < maxAttempts) {
                console.log('Retrying unfollow...');
            }
        }

        console.log('Failed to unfollow after max attempts');
        return null;
    };

    const sendFriendRequest = async () => {
        let attempt = 0;
        const maxAttempts = 2;

        while (attempt < maxAttempts) {
            if (!self) {
                try {
                    const response = await api.post('http://3.76.10.93:5005/addFriend', {
                        follower_id: selfid,
                        followed_id: route.params.userId,
                    });

                    if (response.status === 200) {
                        console.log('Successfully followed');
                        storageEmitter.emit('storageChange');
                        return response.data;
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            console.log('Error:', error.response.data.message);
                        } else {
                            console.log('An error occurred:', error.message);
                        }
                    } else {
                        console.log('An unexpected error occurred:', error);
                    }
                }
            }
            attempt++;
            if (attempt < maxAttempts) {
                console.log('Retrying friend request...');
            }
        }

        console.log('Failed to send friend request after max attempts');
        return null;
    };
    useEffect(() => {
        navigation.setOptions({
            title: route.params.userId === -1 ? 'Default Profile' : `@${user?.username}`,
        });
    }, [navigation, user]);
    const getUserProfile = async (userId: number) => {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/user/profile/${userId}`);

            if (response.status === 200) {


                const serverUser = response.data;

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
                matchedUser.followers = serverUser.followers || [];
                if (serverUser) {
                    const foundFollower = serverUser.followers.find((follower: { id: number, username: string }) => follower.id === 17);
                    setFollowable(!foundFollower)
                }
                setUser(matchedUser);
                setImages(matchedUser?.clothes ?? []);
                setPosts(matchedUser?.posts ?? [])
                setLoading(false);

            }
        } catch (error: unknown) {

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
    const getUserProfilePic = async (userId: number) => {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/get_profile_pic/${userId}`);
            if (response.status === 200) {
                console.log('Profile picture URL:', response.data.profile_pic_url);
                return response.data.profile_pic_url;
            }
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error fetching profile picture:', error.message);
            }
        }
    };
    useEffect(() => {
        const fetchUserProfile = async () => {
            await getUserProfile(route.params.userId);
            const uri = await getUserProfilePic(route.params.userId);
            setPP(uri)
        };
        fetchUserProfile();

        storageEmitter.addListener('storageChange', fetchUserProfile);

        return () => {
            storageEmitter.removeAllListeners('storageChange');
        };
    }, []);
    useEffect(() => {
        getUserId();
    }, [user]);

    const [selectedInfo, setSelectedInfo] = useState('Items');
    const renderContent = () => {
        switch (selectedInfo) {
            case 'Saved':
                return <ScrollView contentContainerStyle={styles.imageGrid}>
                    {images.map(image => (
                        <TouchableOpacity key={image.id} style={styles.imageContainer}>
                            {image.image_url ? (
                                <Image source={{ uri: image.image_url }} style={styles.image} resizeMode="contain" />
                            ) : null}

                        </TouchableOpacity>
                    ))}
                </ScrollView>;

            case 'Items':
                return <ScrollView contentContainerStyle={styles.postGrid}>
                    {posts.map(image => (
                        <TouchableOpacity key={image.id} style={styles.postImage}>
                            {image.image_url ? (
                                <Image source={{ uri: image.image_url }} style={styles.image} resizeMode="contain" />
                            ) : null}

                        </TouchableOpacity>
                    ))}
                </ScrollView>;
            default:
                return <Text>Posts</Text>

        }
    }


    return (<>
        <FlatList
            data={user?.posts}
            renderItem={({ item }) => (
                <Image
                    style={styles.postImage}
                    source={{ uri: item.content }}
                />
            )}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={
                <View>
                    <View style={styles.header}>
                        <View style={styles.profileInfo}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: pp }}
                            />
                            <View style={styles.statsContainer}>
                                <Text style={styles.statValue}>{user?.posts.length}</Text>
                                <Text style={styles.statText}>Posts</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <Text style={styles.statValue}>{user?.followers.length}</Text>
                                <Text style={styles.statText}>Follower</Text>
                            </View>
                            <View style={styles.statsContainer}>
                                <Text style={styles.statValue}>{user?.following.length}</Text>
                                <Text style={styles.statText}>Following</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.name}>{user?.name}{' '}{user?.surname}</Text>
                            {!self && (
                                <TouchableOpacity style={styles.followButton} onPress={handleBtn}>
                                    <Text style={styles.buttonText}>{isFollowable ? 'Follow' : 'Unfollow'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.stats}>
                            <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Items') }}>
                                <Text style={[styles.statNumber, selectedInfo === 'Items' && styles.selectedStatNumber]}>{user?.posts.length}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                                {selectedInfo === 'Items' && <View style={styles.underline}></View>}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.statItem} onPress={() => { setSelectedInfo('Saved') }}>
                                <Text style={[styles.statNumber, selectedInfo === 'Saved' && styles.selectedStatNumber]}>{user?.clothes.length}</Text>
                                <Text style={styles.statLabel}>Wardrobe</Text>
                                {selectedInfo === 'Saved' && <View style={styles.underline}></View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                    {renderContent()}

                </View>

            }
        />
        {loading && <AppLoader />}</>

    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'black',
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        backgroundColor: '#fff'
    },
    profileInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        backgroundColor: '#fff'
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
    avatar: {
        marginLeft: 10,
        width: 80,
        height: 80,
        borderRadius: 50,
        marginRight: 45,
    },
    statsContainer: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 20,
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    statText: {
        color: '#888',
    },
    name: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    description: {
        color: '#888',
    },

    followButton: {
        width: '50%',
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2074f4',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 5,
    },
    postGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    postImage: {
        width: '45%',
        aspectRatio: 0.7,
        margin: 5,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 20,
    },
    imageContainer: {
        width: '42%',
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        padding: 5,
        marginHorizontal: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 0.7,
    },
});

export default ProfileScreen;
