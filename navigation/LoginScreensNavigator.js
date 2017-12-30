import React, { Component } from "react";
import HomeScreen from "../screens/HomeScreen";
import l_ChoiceScreen from "../screens/l_ChoiceScreen";
import l_LoginScreen from "../screens/l_LoginScreen";
import l_RegisterScreen from "../screens/l_RegisterScreen";
import { TabNavigator } from "react-navigation";

export default (LoginScreensNavigator = TabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    l_ChoiceScreen: {
      screen: l_ChoiceScreen,
      navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
    },
    l_LoginScreen: {
      screen: l_LoginScreen,
      navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
    },
    l_RegisterScreen: {
      screen: l_RegisterScreen,
      navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
    },
  },
  {
    tabBarOptions: {
      style: {
        display: 'none',
      },
    },
    swipeEnabled: false,
  }
));
