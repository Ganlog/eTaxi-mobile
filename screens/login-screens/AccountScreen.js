import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: 'User Account',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: '',
      email: '',
      password: '',
      matchingPassword: ''
    }
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <Text>Account Details: </Text>

        {this.state.isLoading ? (
          <ActivityIndicator/>
        ) : (
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <Text>{rowData}</Text>}
          />
        )}

        <Button
          onPress={() => this.props.navigation.navigate('LogRegRouterScreen')}
          title="Login or register"
          color={Colors.tintColor}
          accessibilityLabel="Login or register"
        />


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
