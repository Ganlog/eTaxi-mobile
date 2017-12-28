import React, { Component } from "react";
import AccountScreen from "../screens/login-screens/AccountScreen";
import LogRegRouterScreen from "../screens/login-screens/LogRegRouterScreen";
import LoginScreen from "../screens/login-screens/LoginScreen";
import RegisterScreen from "../screens/login-screens/RegisterScreen";
import { TabNavigator } from "react-navigation";
export default (LoginScreensNavigator = TabNavigator(
  {
    AccountScreen: {
      screen: AccountScreen
    },
    LogRegRouterScreen: {
      screen: LogRegRouterScreen,
      navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
    },
    RegisterScreen: {
      screen: RegisterScreen,
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
