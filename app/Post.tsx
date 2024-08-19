import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { PostModel } from './Models/Post';
import { CommentModel } from './Models/Comment';
import axios, { AxiosError } from 'axios';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import User from './Models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './server/api';

const { width, height } = Dimensions.get('window');

type PostComponentProps = {
    post: PostModel;
    isCommentPanelOpen: boolean;
    setCommentPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostComponent = ({ post, isCommentPanelOpen, setCommentPanelOpen }: PostComponentProps) => {
    const [commentText, setCommentText] = useState<string>('');
    const [comments, setComments] = useState<CommentModel[]>(post.comments);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<User | null>(null);
    const [currentid, setcurrentid] = useState<number>();
    const [pp, setPP] = useState<string>('');

    const getUserProfile = async () => {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/user/profile/${post.user_id}`);

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
                setUser(matchedUser);
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
    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem('user_id');

            if (id) {
                const numericId = Number(id);
                const uri = await getUserProfilePic(numericId);
                setPP(uri)
                setcurrentid(numericId);
            } else {
                console.log('User ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('An error occurred while retrieving the user ID:', error);
        }
    };
    getUserId();
    useEffect(() => {
        getUserProfile();
    }, []);
    const sendComment = async () => {
        try {
            const response = await api.post(`/makeComment/${currentid}/${post.id}`, {
                content: commentText,
            });

            console.log('Comment successfully created:', response.data);
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

    const savePost = async () => {
        const maxRetries = 3;
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success) {
            try {
                attempt++;
                const response = await api.post('/savePost', {
                    user_id: currentid,
                    post_id: post.id,
                });

                if (response.status === 200) {
                    console.log('Post saved successfully:', response.data.message);
                    success = true;
                }
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response) {
                        console.error('Error saving post:', error.response.data.message);
                    } else {
                        console.error('Error:', error.message);
                    }
                }

                if (attempt < maxRetries) {
                    console.log(`Retrying... (${attempt}/${maxRetries})`);
                } else {
                    console.error('Max retries reached. Failed to save post.');
                }
            }
        }
    };

    const handleProfilePress = async () => {
        const numericId = Number(post.user_id);
        navigation.navigate('ProfileScreen', { userId: numericId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather name="user" size={24} color="black" />
                <Text onPress={handleProfilePress} style={styles.username}>{user?.username} </Text>
                <Text style={styles.time}>{post.timestamp.toLocaleString()}</Text>
            </View>
            <Image source={{ uri: post.image_url }} style={styles.image} resizeMode="contain" />
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => setCommentPanelOpen(true)}>
                    <View style={styles.footerItemMid}>
                        <Feather name="message-square" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { savePost() }}>
                    <View style={styles.footerItemLast} >
                        <MaterialIcons name="save-alt" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
            <Text style={styles.commentText}>Show all {comments.length} comments</Text>

            <Modal
                isVisible={isCommentPanelOpen}
                onBackdropPress={() => setCommentPanelOpen(false)}
                swipeDirection="down"
                onSwipeComplete={() => setCommentPanelOpen(false)}
                style={styles.modal}
            >
                <View style={styles.modalContainer}>
                    <ScrollView style={styles.modalContent}>
                        <Text>Comments</Text>
                        <View style={styles.separator} />

                        {comments.map(comment => (
                            <View style={styles.commentContainer}>
                                <Image
                                    source={{ uri: pp }}
                                    style={styles.profilePic}
                                />
                                <View style={styles.commentContent}>
                                    <Text style={styles.cusername}>{user?.username}</Text>
                                    <Text>{comment.content}</Text>
                                </View>
                                <View style={styles.separator} />
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={24} color="black" />
                        <TextInput
                            style={styles.input}
                            placeholder="Add Comment"
                            keyboardType="default"
                            value={commentText}
                            onChangeText={(text) => setCommentText(text)}
                        />
                        <TouchableOpacity onPress={sendComment}>
                            <Feather name="send" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cccccc',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePic: {
        width: 40, // Adjust the size as needed
        height: 40, // Adjust the size as needed
        borderRadius: 20, // To make the profile picture circular
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    cusername: {
        fontWeight: 'bold',
    },
    separator: {
        marginTop: 5,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    input: {
        color: '#000',
        fontFamily: 'Montserrat',
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
    },
    itemText: {
        marginLeft: 10,
    },
    likeText: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        marginLeft: 10,
        fontSize: 12,
        color: 'gray',
    },
    footerItemLast: {
        marginLeft: 280,
        marginRight: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    username: {
        marginLeft: 5,
        fontWeight: 'bold',
    },
    time: {
        marginLeft: 5,
        color: 'gray',
    },
    image: {
        width: '100%',
        aspectRatio: 0.7,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    footerItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    footerItemMid: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        height: height * 0.75,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden',
    },
    modalContent: {
        padding: 20,
        flex: 1,
    },
});

export default PostComponent;
