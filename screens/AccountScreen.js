import React from 'react';
import { Keyboard, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {}
  }


  componentWillReceiveProps(props){
  }


  _logout() {
    UserInfo.eraseInfo();
    ScreenNavigation.goto('l_ChoiceScreen');
  };


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Your {UserInfo.userType} account details</Text>
        </View>

        <Text><Text style={styles.bold}> Username: </Text> {UserInfo.username}</Text>
        <Text><Text style={styles.bold}> First name: </Text> {UserInfo.firstName}</Text>
        <Text><Text style={styles.bold}> Last name: </Text> {UserInfo.lastName}</Text>
        <Text><Text style={styles.bold}> Email: </Text> {UserInfo.email}</Text>

        {(UserInfo.userType == 'driver') ? (
          <View>
            <Text><Text style={styles.bold}> Price per kilometer: </Text> {UserInfo.pricePerKilometer}</Text>
            <Text><Text style={styles.bold}> Kind of service: </Text> {UserInfo.serviceKind}</Text>
            <Text><Text style={styles.bold}> Car manufacture year: </Text> {UserInfo.manufactureYear}</Text>
            <Text><Text style={styles.bold}> Color: </Text> {UserInfo.color}</Text>
            <Text><Text style={styles.bold}> Car Model: </Text> {UserInfo.carModel}</Text>
            <Text><Text style={styles.bold}> Number of Seats: </Text> {UserInfo.numberOfSeats}</Text>
          </View>
        ) : (null) }

        <View style={{ height: 15 }} />
        <Button
          onPress={() => this._logout() }
          title='Logout'
          color={'red'}
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
    marginBottom: 5,
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
  bold: {
    fontWeight: 'bold',
    lineHeight: 30,
  },
});
