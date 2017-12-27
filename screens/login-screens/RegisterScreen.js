import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register your account',
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

  register(username, email, password, matchingPassword) {
    this.setState({ isLoading: false });
    return fetch('http://85.255.11.29:8080//api/v1/users/register', {
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
      console.log(responseJson);
      if(responseJson.errors){
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.errors),
        }, function() {
          // do something with new state
        });
      }
      else if(responseJson.message) {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.message),
        }, function() {
          // do something with new state
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };



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
          onPress={() => this.register(this.state.username, this.state.email, this.state.password, this.state.matchingPassword)}
          title="Register"
          color={Colors.tintColor}
          accessibilityLabel="Register"
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
