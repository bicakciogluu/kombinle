import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { format } from 'date-fns';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from './WelcomeTabs'; // TabParamList tanımını buraya import edin
import { getDocs, updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import OutfitAddModal from './OutfitAddModal';
import AppLoader from './AppLoader';

type PlannerScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Planner'>;

interface PlannerProps {
  navigation: PlannerScreenNavigationProp;
}
const Planner: React.FC<PlannerProps> = ({ navigation }) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ['30%'];
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    bottomSheetModalRef.current?.close();
  };
  const onDayPress = (day: { dateString: string; }) => {
    setLoading(true);
    setSelectedDate(day.dateString);
    getOutfitFromFirestore(day.dateString);

  };
  const handleImageSelect = (img: string) => {
    setImageUri(img);
    setLoading(true)
    pushOutfitToFirestore(selectedDate, img);
    closeModal();
  }
  const getOutfitFromFirestore = async (date: string) => {
    const userUid = await AsyncStorage.getItem('userUid');
    if (!userUid) {
      Alert.alert('Error', 'User ID not found in AsyncStorage');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userUid);

      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const dates = userData.dates || {};

        if (dates[date] && dates[date].length > 0) {
          setImageUri(dates[date][0]);
          return true;
        } else {
          setImageUri(null);
          return false;
        }
      } else {
        console.error('User document not found!');
        setImageUri(null);
        return false;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      setImageUri(null);
      return false;
    }
    finally {
      setLoading(false)
    }
  };
  const pushOutfitToFirestore = async (date: string, imageUri: string) => {
    const userUid = await AsyncStorage.getItem('userUid');
    if (!userUid) {
      Alert.alert('Error', 'User ID not found in AsyncStorage');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userUid);

      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const dates = userData.dates || {};

        if (!dates[date]) {
          dates[date] = [];
        }

        dates[date].push(imageUri);

        await updateDoc(userDocRef, { dates });

        Alert.alert('Success', 'Outfit added to today\'s date!');
      } else {
        Alert.alert('Error', 'User document not found!');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true)
    getOutfitFromFirestore(selectedDate);
  }, []);
  const [fontsLoaded] = useFonts({
    'SpaceMonoRegular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceMonoBold': require('@/assets/fonts/SpaceMono-Bold.ttf'),
  });

  const dayOfWeek = format(new Date(), 'EEEE');
  const getToday = () => format(new Date(), 'd MMMM yyyy');

  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const toggleSwitch = () => setIsNotificationOn((previousState) => !previousState);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>

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
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.mainImage} />
              </View>
            ) : (
              <View style={styles.content}>
                <Text style={styles.question}>What are you wearing today?</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={[styles.button, styles.createButton]} onPress={() => { bottomSheetModalRef.current?.present(); }}>
                    <Text style={styles.buttonText}>Add from your outfits</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.discoverButton]} onPress={() => { navigation.jumpTo('Styling') }}>
                    <Text style={styles.buttonText}>Create new outfits</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </CalendarProvider>
          {loading && <AppLoader />}

        </View>
        <BottomSheetModal
          enableContentPanningGesture={false}
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          style={[styles.bottomModal, { backgroundColor: '#FEFAE0' }]}
        >
          <View style={styles.bottomModalContent}>
            <OutfitAddModal closeModal={handleImageSelect} />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider >
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    backgroundColor: 'white', // White background for the frame
    padding: 10, // Padding to create the frame effect
    borderRadius: 10, // Optional: to give the frame rounded corners
    margin: 20, // Optional: to give some space around the container
    elevation: 3, // Optional: to give the frame a slight shadow on Android
    shadowColor: '#000', // Optional: shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: shadow offset for iOS
    shadowOpacity: 0.25, // Optional: shadow opacity for iOS
    shadowRadius: 3.84, // Optional: shadow radius for iOS
  },
  bottomModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  mainImage: {
    width: '80%',
    height: 'auto',
    aspectRatio: 0.70,
    resizeMode: 'cover',
  },
  bottomModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 0,
  },
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
    paddingTop: 40,
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
  },
  content: {
    alignItems: 'center',
  },
  question: {
    marginTop: 50,
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
    aspectRatio: 1,
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
