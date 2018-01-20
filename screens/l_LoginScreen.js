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
    this._focusNextField = this._focusNextField.bind(this);
    this.inputs = {};
    this.state = {
      isLoading: false,
      response: '',
      username: '',
      password: '',
      loginSuccess: false
    }
  }

  _clearLoginData(){
    this.setState({
      response: '',
      isLoading: false,
      loginSuccess: null,
    });

    this.inputs['UsernameInput'].clear();
    this.inputs['PasswordInput'].clear();
    this.setState({
      username: null,
      password: null,
    });
  }

  _focusNextField(id) {
    this.inputs[id].focus();
  }


  _login(username, password) {
    this.setState({ isLoading: true });

    const formBody = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const hashedCredentials = Encript.btoa(username+':'+password);
    fetch('http://85.255.11.29:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic '+hashedCredentials
      },
      body: formBody
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.error){
        this.setState({
          response: <Text style={{ color: 'red' }}>{responseJson.error}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.message && responseJson.message == 'LOGIN_SUCCESS') {
        UserInfo.storeParam('token', hashedCredentials);
        this.setState({
          response: 'Login successful',
          loginSuccess: true
        });
        fetch('http://85.255.11.29:8080/api/v1/users/current', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic '+hashedCredentials
          }
        })
        .then((response) => response.json())
        .then((resp) => {
          console.log(resp);
          if(resp.error){
            this.setState({
              response: <Text style={{ color: 'red' }}>{resp.error}</Text>,
            });
          }
          else{
            UserInfo.storeParam('token', hashedCredentials);
            UserInfo.storeParam('avatar', resp.avatar.image);
            UserInfo.storeParam('userType', (resp.role[0].role == 'STANDARD_USER') ? 'user' : (resp.role[0].role == 'DRIVER_USER') ? 'driver' : 'admin');
            UserInfo.storeParam('username', resp.username);
            UserInfo.storeParam('firstName', resp.firstName);
            UserInfo.storeParam('lastName', resp.lastName);
            UserInfo.storeParam('email', resp.email);

            if(UserInfo.userType == 'driver'){
              UserInfo.storeParam('pricePerKilometer', resp.pricePerKilometer);
              UserInfo.storeParam('serviceKind', resp.serviceKind);
              UserInfo.storeParam('manufactureYear', resp.manufactureYear);
              UserInfo.storeParam('color', resp.color);
              UserInfo.storeParam('carModel', resp.carModel);
              UserInfo.storeParam('numberOfSeats', resp.numberOfSeats);
            }
            this.setState({
              response: "Successfully logged in",
              isLoading: false,
              registerSuccess: true
            });
          }
        })
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };


  _openApplication(){
    this._clearLoginData();
    ScreenNavigation.goto('HomeScreen');
  }







  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['UsernameInput'] = input; }}
          onChangeText={username => this.setState({username})}
          placeholder='Full Name'
          autoCapitalize='none'
          keyboardType='default'
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => { this._focusNextField('PasswordInput'); }}
        />
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['PasswordInput'] = input; }}
          onChangeText={password => this.setState({password})}
          placeholder='Password'
          autoCapitalize='none'
          returnKeyType='done'
          secureTextEntry={true}
          blurOnSubmit={false}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button
          onPress={() => this._login(this.state.username, this.state.password)}
          title='Login'
          color={Colors.tintColor}
        />


        {this.state.isLoading ? (
          <ActivityIndicator/>
        ) : (
          <Text style={styles.alignCenter}>{this.state.response}</Text>
        )}

        {this.state.loginSuccess ? (
          <View>
            <View style={{margin: 5}} />
            <Button
              onPress={() => this._openApplication()}
              title='Open Application'
              color={Colors.tintColor}
            />
          </View>) : ( null )
        }

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
