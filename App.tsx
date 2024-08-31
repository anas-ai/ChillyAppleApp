import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigator} from './src/Navigator/AppNavigator';
import {AuthProvider} from './src/Context/Auth';
import {ToastProvider} from 'react-native-toast-notifications';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider
        placement="bottom"
        duration={3000}
        animationType="zoom-in"
        animationDuration={250}
        successColor="green"
        dangerColor="red"
        warningColor="orange"
        normalColor="grey"
        // icon={<Icon />}
        // successIcon={<SuccessIcon />}
        // dangerIcon={<DangerIcon />}
        // warningIcon={<WarningIcon />}
        textStyle={{fontSize: 14}}
        offset={50} // offset for both top and bottom toasts
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled={true}>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
