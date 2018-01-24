import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import ScreenNavigation from '../global/ScreenNavigation';

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
          <Text style={styles.titleText}>Zaloguj się lub zarejestruj konto</Text>
        </View>
        <Button
          onPress={() => ScreenNavigation.goto('l_LoginScreen')}
          title='Zaloguj się'
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: 'user'})}
          title='Zarejestruj się jako pasażer'
          color={Colors.tintColor}
        />
        <View style={{margin: 5}} />
        <Button
          onPress={() => ScreenNavigation.goto('l_RegisterScreen', {userType: 'driver'})}
          title='Zarejestruj się jako kierowca'
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
