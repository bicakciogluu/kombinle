
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
const Explore = () =>{
    const today = new Date().toISOString().split('T')[0];

  const onDayPress = (day: any) => {
    Alert.alert('Selected Day', `You selected ${day.dateString}`);
  };

  return (
    <CalendarProvider date={today}>
      <WeekCalendar
        onDayPress={onDayPress}
        markedDates={{
          [today]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        theme={{
          selectedDayBackgroundColor: 'green',
          todayTextColor: 'red',
          dayTextColor: 'black',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.heading}>What are you Whering today?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Add from wardrobe')}>
            <Text style={styles.buttonText}>Add from wardrobe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Create new outfit')}>
            <Text style={styles.buttonText}>Create new outfit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Discover new outfits')}>
            <Text style={styles.buttonText}>Discover new outfits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Upload OOTD photo')}>
            <Text style={styles.buttonText}>Upload OOTD photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CalendarProvider>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 20,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#87CEFA',
      padding: 10,
      margin: 5,
      borderRadius: 5,
      width: '40%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
export default Explore;