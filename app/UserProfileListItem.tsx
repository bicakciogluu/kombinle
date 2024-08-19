import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import axios from 'axios';

type UPLI = {
    username: string;
    fullname: string;
    userid: number;

};
const UserProfileListItem: React.FC<UPLI> = ({
    username,
    fullname,
    userid

}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [pp, setPP] = useState<string>('');

    const getUserProfilePic = async () => {
        try {
            const response = await axios.get(`http://3.76.10.93:5005/get_profile_pic/${userid}`);
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
        const a = async () => {
            const uri = await getUserProfilePic();
            setPP(uri)
        }
        a()
    }, []);
    const handleProfilePress = async () => {
        navigation.navigate('ProfileScreen', { userId: userid });
    };
    return (
        <TouchableOpacity style={styles.container} onPress={handleProfilePress}>
            <View style={styles.backButtonContainer}>
                <Image source={{ uri: pp }} style={styles.profileImage} />
            </View>
            <View style={styles.userInfoContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.fullName}>{fullname}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButtonContainer: {
        backgroundColor: '#333',
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 15,
    },
    userInfoContainer: {
        marginLeft: 15,
        flexDirection: 'column',
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    fullName: {
        fontSize: 12,
        color: '#888',
    },
});

export default UserProfileListItem;
