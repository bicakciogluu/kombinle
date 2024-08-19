
import React from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';

const data = [
  {
    id: '1',
    user: 'Serhat',
    text: 'liked your post',
    image: '@/assets/images/logo.png',
  },
  {
    id: '2',
    user: 'Fatih ve Aysegul',
    text: 'saved your post',
    image: '@/assets/images/logo.png',
  },
  {
    id: '3',
    user: 'Aashita',
    text: 'viewed your wardrobe',
    image: '@/assets/images/logo.png',
  },

];
const Notifications = () =>{
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Avatar
              rounded
              source={require('@/assets/images/logo.png')}
              size="medium"
            />
            <View style={styles.textContainer}>
              <Text style={styles.user}>{item.user}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  user: {
    fontWeight: 'bold',
  },
  text: {
    color: '#555',
  },
});


export default Notifications;