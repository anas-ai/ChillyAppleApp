import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthData, NavigationData} from '../NavigatonData/NavigationData';
import {ScreenName} from '../utils/constants';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {colors} from '../styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {ListItem} from '@rneui/themed';
import {useAuth} from '../Context/Auth';
import axios from 'axios';
import {BASE_URL} from '../api';
import {CustomDrawerContent} from './CustomDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export const StackNavigator = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={ScreenName.LOGIN_SCREEN}>
      {NavigationData.map((item, index) => (
        <Stack.Screen
          key={item.name}
          name={item?.name}
          component={item?.component}
          options={{headerShown: false}}
        />
      ))}
    </Stack.Navigator>
  );
};
export const AuthNavigator = (props: any) => {
  return (
    <Stack.Navigator initialRouteName={ScreenName.LOGIN_SCREEN}>
      {AuthData.map((item, index) => (
        <Stack.Screen
          key={index}
          name={item?.name}
          component={item?.component}
          options={{headerShown: false}}
        />
      ))}
    </Stack.Navigator>
  );
};

export const DrawerNavigator = () => {
  const {isAuthenticated} = useAuth();

  if (isAuthenticated) {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {width: '80%'},
          headerShown: false,
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="testHome" component={AuthNavigator} />
      </Drawer.Navigator>
    );
  } else {
    return <StackNavigator />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
  },
  menuItem: {
    padding: 15,
    fontSize: 15,
    color: colors.black,
    fontWeight: '400',
  },
  accordionTitle: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
  },
  subMenuItem: {
    paddingLeft: 16,
    fontSize: 15,
    fontWeight: '400',
    color: colors.black,
  },
  sub2MenuItem: {
    paddingLeft: 30,
  },
  graytextColor: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 10,
  },
  myIformationContainer: {paddingHorizontal: 10},
  myIformationTxt: {
    padding: 16,
    color: colors.black,
    fontSize: 15,
    fontWeight: '400',
    paddingLeft: 16,
  },
});
