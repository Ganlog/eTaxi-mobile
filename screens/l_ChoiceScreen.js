import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import ScreenNavigation from '../global/ScreenNavigation';
import { NavigationActions } from 'react-navigation';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
  };









  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Login or register</Text>
        </View>
        <Button
          onPress={() => ScreenNavigation.goto('l_LoginScreen')}
          title='Log in'
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: 'user'})}
          title='Register as user'
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: 'driver'})}
          title='Register as driver'
          color={Colors.tintColor}
        />
      </View>
    );
  }
}









const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    backgroundColor: Colors.tintColor,
    marginBottom: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
