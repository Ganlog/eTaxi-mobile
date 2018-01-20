import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import Encript from '../global/Encript';
import ScreenNavigation from '../global/ScreenNavigation';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login to your account',
  };


  constructor(props) {
    super(props);
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.state = {
      isLoading: false,
      response: '',
      username: '',
      password: '',
    }
  }


  focusNextField(id) {
    this.inputs[id].focus();
  }


  _login(username, password) {
    this.setState({ isLoading: true });

    const formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`;
    console.log(formBody);
    const hashedCredentials = Encript.btoa(username+':'+password);
    console.log(hashedCredentials);
    fetch('http://85.255.11.29:8080/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: "Basic ${hashedCredentials}"
      },
      body: formBody
    })
    .then((response) => response.json())
    .then((responseJson) => {
      UserInfo.storeParam('token', hashedCredentials);
      if(responseJson.error){
        this.setState({
          response: <Text style={{ color: 'red' }}>{responseJson.error}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.access_token) {
        UserInfo.storeParam('token', responseJson.access_token);
        UserInfo.storeParam('username', this.state.username);

        this.inputs['UsernameInput'].clear();
        this.inputs['PasswordInput'].clear();
        this.setState({
          isLoading: false,
          response: '',
          username: '',
          password: '',
        });

        ScreenNavigation.goto('HomeScreen');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };









  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['UsernameInput'] = input; }}
          onChangeText={username => this.setState({username})}
          placeholder="Full Name"
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => { this.focusNextField('PasswordInput'); }}
        />
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['PasswordInput'] = input; }}
          onChangeText={password => this.setState({password})}
          placeholder="Password"
          autoCapitalize="none"
          returnKeyType="next"
          secureTextEntry={true}
          blurOnSubmit={false}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button
          onPress={() => this._login(this.state.username, this.state.password)}
          title="Login"
          color={Colors.tintColor}
        />


        {this.state.isLoading ? (
          <ActivityIndicator/>
        ) : (
          <Text style={styles.alignCenter}>{this.state.response}</Text>
        )}

      </View>
    );
  }
}









const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    height: 40,
    borderWidth: 1
  },
  alignCenter: {
    textAlign: 'center',
  },
});
