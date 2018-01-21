import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import ScreenNavigation from '../global/ScreenNavigation';
import { NavigationActions } from 'react-navigation';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login or register',
    headerStyle: {
     backgroundColor: Colors.tintColor
   },
  };


  constructor(props) {
    super(props);
  };









  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <Button
          onPress={() => ScreenNavigation.goto('l_LoginScreen')}
          title="Log in"
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: "user"})}
          title="Register as user"
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: "driver"})}
          title="Register as driver"
          color={Colors.tintColor}
        />
      </View>
    );
  }
}









const styles = StyleSheet.create({

});
