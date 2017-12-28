import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login to your account',
  };


  constructor(props) {
    super(props);
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.state = {
      isLoading: true,
      username: '',
      email: '',
      password: '',
      matchingPassword: ''
    }
  }


  focusNextField(id) {
    this.inputs[id].focus();
  }


  login(username, password) {
    this.setState({ isLoading: false });
    return fetch('http://85.255.11.29:8080//oauth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);

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
          onSubmitEditing={() => { this.focusNextField('MatchPassInput'); }}
        />
        <Button
          onPress={() => this.login(this.state.username, this.state.email, this.state.password, this.state.matchingPassword)}
          title="Login"
          color={Colors.tintColor}
          accessibilityLabel="Login"
        />


        {this.state.isLoading ? (
          <ActivityIndicator/>
        ) : (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <Text>{rowData}</Text>}
          />
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
    marginTop: 20,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
});
