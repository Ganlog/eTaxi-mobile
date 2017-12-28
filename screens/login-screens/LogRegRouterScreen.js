import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login or register',
  };


  constructor(props) {
    super(props);
  }


  componentDidMount() {

  }









  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <Button
          onPress={() => this.props.navigation.navigate('LoginScreen')}
          title="Log in"
          color={Colors.tintColor}
          accessibilityLabel="Log in"
        />
        <Button
          onPress={() => this.props.navigation.navigate('RegisterScreen')}
          title="Register"
          color={Colors.tintColor}
          accessibilityLabel="Register"
        />
      </View>
    );
  }
}









const styles = StyleSheet.create({

});
