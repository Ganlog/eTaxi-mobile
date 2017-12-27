import React, { Component } from "react";
import AccountScreen from "./AccountScreen";
import LogRegRouterScreen from "./LogRegRouterScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { TabNavigator } from "react-navigation";
import {
  Button,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label
} from "react-native";
export default (LoginScreensNavigator = TabNavigator(
  {
    AccountScreen: { screen: AccountScreen },
    LogRegRouterScreen: {
      screen: LogRegRouterScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
      })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
      })
    },
    RegisterScreen: {
      screen: RegisterScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
      })
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
