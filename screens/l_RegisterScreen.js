import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register your account',
  };


  constructor(props) {
    super(props);
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.state = {
      isLoading: false,
      response: '',
      regTokenReceived: null,
      registerSuccess: false,
      username: '',
      email: '',
      password: '',
      matchingPassword: ''
    }
  }


  focusNextField(id) {
    this.inputs[id].focus();
  }


  _register(username, email, password, matchingPassword) {
    this.setState({ isLoading: true})
    return fetch('http://85.255.11.29:8080/api/v1/users/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        matchingPassword: matchingPassword,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errors){
        this.setState({
          response: <Text style={{ color: 'red' }}>{responseJson.errors}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.message) {
        this.setState({
          response: responseJson.message,
          regTokenReceived: responseJson.object,
          isLoading: false,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };


  _confirmRegistration(){
    this.setState({ isLoading: true})
    return fetch('http://85.255.11.29:8080/api/v1/users/registrationConfirm/'+this.state.regTokenReceived, {
      method: 'GET',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errors){
        this.setState({
          response: <Text style={{ color: 'red' }}>{responseJson.errors}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.message) {
        UserInfo.storeParam('username', this.state.username);
        UserInfo.storeParam('email', this.state.email);
        this.setState({
          response: responseJson.message,
          isLoading: false,
          registerSuccess: true
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };


  _openApplication(){
    this.inputs['UsernameInput'].clear();
    this.inputs['EmailInput'].clear();
    this.inputs['PasswordInput'].clear();
    this.inputs['MatchPassInput'].clear();

    this.setState({
      response: '',
      regTokenReceived: null,
      registerSuccess: false,
      username: '',
      email: '',
      password: '',
      matchingPassword: '',
    });

    ScreenNavigation.goto('HomeScreen');
  }






  render() {
    const { navigate } = this.props.navigation;
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
          onSubmitEditing={() => { this.focusNextField('EmailInput'); }}
        />
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['EmailInput'] = input; }}
          onChangeText={email => this.setState({email})}
          placeholder="email@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
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
          onSubmitEditing={() => { this.focusNextField('MatchPassInput'); }}
        />
        <TextInput
          style={styles.input}
          ref={ input => { this.inputs['MatchPassInput'] = input; }}
          onChangeText={matchingPassword => this.setState({matchingPassword})}
          placeholder="Repeat password"
          autoCapitalize="none"
          keyboardType="default"
          secureTextEntry={true}
          blurOnSubmit={true}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button
          onPress={() => this._register(this.state.username, this.state.email, this.state.password, this.state.matchingPassword)}
          title="Register"
          color={Colors.tintColor}
        />


        {this.state.isLoading ? (
          <ActivityIndicator/>
        ) : (
          <Text>{this.state.response}</Text>
        )}


        {this.state.regTokenReceived ? (
          <Button
            onPress={() => this._confirmRegistration()}
            title="Confirm registration"
            color={Colors.tintColor}
          />
        ) : ( null )}

        {this.state.registerSuccess ? (
          <View>
            <View style={{margin: 5}} />
            <Button
              onPress={() => this._openApplication()}
              title="Open Application"
              color={Colors.tintColor}
            />
          </View>
        ) : ( null )}
      </View>
    );
  }
}









const styles = StyleSheet.create({
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
    marginTop: 20,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
});
