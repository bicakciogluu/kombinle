import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styling from './Styling';
import Planner from './Planner';
import Wardrobe from './Wardrobe';
import Create from './Create';
import SocialMedia from './Timeline/Drawer';
import { Feather } from '@expo/vector-icons';
import { updateUserProfile } from './server/api';
export type TabParamList = {
  Community: undefined;
  Create: undefined;
  Planner: undefined;
  Styling: undefined;
  Wardrobe: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

const WelcomeTabs = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;
          let activeColor: string;

          switch (route.name) {
            case 'Community':
              iconName = 'home';
              activeColor = focused ? '#36BA98' : 'gray';
              return (<Feather name="globe" size={size} color={activeColor} />);
            case 'Create':
              iconName = 'plus';
              activeColor = focused ? '#EF9C66' : 'gray';
              break;
            case 'Planner':
              iconName = 'calendar';
              activeColor = focused ? '#FF4191' : 'gray';
              break;
            case 'Styling':
              iconName = 'brush';
              activeColor = focused ? '#FFD0D0' : 'gray';
              break;
            case 'Wardrobe':
              iconName = 'wardrobe';
              activeColor = focused ? '#91DDCF' : 'gray';
              break;
            default:
              iconName = 'home';
              activeColor = focused ? '#6C63FF' : 'gray';
          }

          return <Icon name={iconName} color={activeColor} size={size} />;
        },
        tabBarLabel: ({ focused }) => {
          let labelColor: string;

          switch (route.name) {
            case 'Community':
              labelColor = focused ? '#36BA98' : 'gray';
              break;
            case 'Create':
              labelColor = focused ? '#EF9C66' : 'gray';
              break;
            case 'Planner':
              labelColor = focused ? '#FF4191' : 'gray';
              break;
            case 'Styling':
              labelColor = focused ? '#FFD0D0' : 'gray';
              break;
            case 'Wardrobe':
              labelColor = focused ? '#91DDCF' : 'gray';
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
      <Tab.Screen
        name="Community"
        component={SocialMedia}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Planner"
        component={Planner}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Styling"
        component={Styling}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={Wardrobe}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}



export default WelcomeTabs;
