import React from 'react';
import { Keyboard, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: 'User Account',
    headerStyle: {
     backgroundColor: Colors.tintColor
   },
  };


  constructor(props) {
    super(props);
    this.state = {
    }
  }


  componentWillReceiveProps(props){
    console.log(props);
  }


  _logout() {
    UserInfo.eraseInfo();
    ScreenNavigation.goto('l_ChoiceScreen');
  };


  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <Text style={styles.titleText}>
          Your {UserInfo.userType} account Details:
        </Text>

        <Text><Text style={styles.bold}> Username: </Text> {UserInfo.username}</Text>
        <Text><Text style={styles.bold}> FirstName: </Text> {UserInfo.firstName}</Text>
        <Text><Text style={styles.bold}> LastName: </Text> {UserInfo.lastName}</Text>
        <Text><Text style={styles.bold}> Email: </Text> {UserInfo.email}</Text>

        {(UserInfo.userType == 'driver') ? (
          <View>
            <Text><Text style={styles.bold}> PricePerKilometer: </Text> {UserInfo.pricePerKilometer}</Text>
            <Text><Text style={styles.bold}> ServiceKind: </Text> {UserInfo.serviceKind}</Text>
            <Text><Text style={styles.bold}> ManufactureYear: </Text> {UserInfo.manufactureYear}</Text>
            <Text><Text style={styles.bold}> Color: </Text> {UserInfo.color}</Text>
            <Text><Text style={styles.bold}> CarModel: </Text> {UserInfo.carModel}</Text>
            <Text><Text style={styles.bold}> NumberOfSeats: </Text> {UserInfo.numberOfSeats}</Text>
          </View>
        ) : (null) }

        <View style={{ height: 15 }} />
        <Button
          onPress={() => this._logout() }
          title="Logout"
          color={'red'}
        />
      </View>
    );
  }
}








const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    lineHeight: 30,
  },
});
