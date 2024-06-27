import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styling from './Styling';
import Planner from './Planner';
import Wardrobe from './Wardrobe';
import Explore from './Explore';
import Timeline from './TimeLine'; // Replace with your actual Timeline component

const Tab = createBottomTabNavigator();

const WelcomeTabs=()=> {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
  
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;
          let activeColor: string;

          switch (route.name) {
            case 'Timeline':
              iconName = 'home';
              activeColor = focused ? '#36BA98' : 'gray';
              break;
            case 'Explore':
              iconName = 'compass'; // changed to 'compass' as 'world' is not available in MaterialCommunityIcons
              activeColor = focused ? '#EF9C66' : 'gray'; // Tomato color
              break;
            case 'Planner':
              iconName = 'calendar';
              activeColor = focused ? '#FF4191' : 'gray'; // Gold color
              break;
            case 'Styling':
              iconName = 'brush';
              activeColor = focused ? '#FFD0D0' : 'gray'; // LimeGreen color
              break;
            case 'Wardrobe':
              iconName = 'wardrobe';
              activeColor = focused ? '#91DDCF' : 'gray'; // DodgerBlue color
              break;
            default:
              iconName = 'home'; // Default to home
              activeColor = focused ? '#6C63FF' : 'gray'; // Default active color
          }

          return <Icon name={iconName} color={activeColor} size={size} />;
        },
        tabBarLabel: ({ focused }) => {
          let labelColor: string;

          switch (route.name) {
            case 'Timeline':
              labelColor = focused ? '#36BA98' : 'gray';
              break;
            case 'Explore':
              labelColor = focused ? '#EF9C66' : 'gray'; // Tomato color
              break;
            case 'Planner':
              labelColor = focused ? '#FF4191' : 'gray'; // Gold color
              break;
            case 'Styling':
              labelColor = focused ? '#FFD0D0' : 'gray'; // LimeGreen color
              break;
            case 'Wardrobe':
              labelColor = focused ? '#91DDCF' : 'gray'; // DodgerBlue color
              break;
            default:
              labelColor = focused ? '#6C63FF' : 'gray'; // Default active color
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
      <Tab.Screen
        name="Timeline"
        component={Timeline}
      />
      <Tab.Screen
        name="Explore"
        component={Explore}
      />
      <Tab.Screen
        name="Planner"
        component={Planner}
      />
      <Tab.Screen
        name="Styling"
        component={Styling}
      />
      <Tab.Screen
        name="Wardrobe"
        component={Wardrobe}
      />
    </Tab.Navigator>
  );
}



export default WelcomeTabs;
