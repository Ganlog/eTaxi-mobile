import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Colors from '../constants/Colors';
import ScreenNavigation from '../global/ScreenNavigation';
import AboutScreen from '../screens/AboutScreen';
import AccountScreen from '../screens/AccountScreen';
import LoginScreensNavigator from './LoginScreensNavigator';


export default TabNavigator(
  {
    'Strona startowa': {
      screen: LoginScreensNavigator,
    },
    'O aplikacji': {
      screen: AboutScreen,
    },
    'Informacje o koncie': {
      screen: AccountScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (scene, jumpToIndex) => {
        let destinationScreen = scene.route.routeName + ((scene.route.routeName == 'Home') ? 'Screen' : '');
        ScreenNavigation.goto(destinationScreen, {refresh: true})
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Strona startowa':
            iconName = Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home';
            break;
          case 'O aplikacji':
            iconName = Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle';
            break;
          case 'Informacje o koncie':
           iconName = Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
