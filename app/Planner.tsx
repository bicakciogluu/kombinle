import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';

const Planner = () => {
  const today = new Date().toISOString().split('T')[0];

  const onDayPress = (day: { dateString: any; }) => {
    Alert.alert('Selected Day', `You selected ${day.dateString}`);
  };

  let [fontsLoaded] = useFonts({
    'SpaceMonoRegular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceMonoBold': require('@/assets/fonts/SpaceMono-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const dayOfWeek = format(new Date(), 'EEEE');
  const getToday = () => format(new Date(), 'd MMMM yyyy');

  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const toggleSwitch = () => setIsNotificationOn((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayText}>15.0°C <Ionicons name="cloud" size={20} color="black" /> </Text>
          <Text style={styles.dateText}>{getToday()}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleSwitch} style={styles.switch}>
            {isNotificationOn ? (
              <Ionicons name="notifications-off-sharp" size={20} color="black" />
            ) : (
              <Ionicons name="notifications-sharp" size={20} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <CalendarProvider date={today} >
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
        <View style={styles.content}>
          <Text style={styles.question}>What are you Whering today?</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Add from wardrobe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.createButton]}>
              <Text style={styles.buttonText}>Create new outfit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.discoverButton]}>
              <Text style={styles.buttonText}>Discover new outfits</Text>
              <Text style={styles.betaLabel}>BETA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.uploadButton]}>
              <Text style={styles.buttonText}>Upload OOTD photo</Text>
              <Text style={styles.newLabel}>NEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CalendarProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  switchIcon: {
    width: 24,
    height: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  dateContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayText: {
    fontSize: 20,
    fontFamily: 'SpaceMonoBold',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'SpaceMonoRegular',
    color: '#888',
  },
  iconContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },content: {
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'SpaceMonoBold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: '40%',
    margin: 10,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#00BFFF',
  },
  createButton: {
    backgroundColor: '#DA70D6',
  },
  discoverButton: {
    backgroundColor: '#FF4500',
    position: 'relative',
  },
  uploadButton: {
    backgroundColor: '#ADFF2F',
    position: 'relative',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceMonoRegular',
  },
  betaLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000',
    color: '#fff',
    padding: 3,
    borderRadius: 3,
    fontSize: 10,
    fontFamily: 'SpaceMonoRegular',
  },
  newLabel: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000',
    color: '#fff',
    padding: 3,
    borderRadius: 3,
    fontSize: 10,
    fontFamily: 'SpaceMonoRegular',
  },
});

export default Planner;
