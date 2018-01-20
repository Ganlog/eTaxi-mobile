import React from 'react';
import { Keyboard, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: 'User Account',
  };


  constructor(props) {
    super(props);
    this.state = {
    }
  }


  componentWillReceiveProps(props){
    console.log(props);
  }



  render() {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <Text style={styles.titleText}>
          Your {this.state.userType} account Details:
        </Text>

        <Text> Username: {UserInfo.username}</Text>
        <Text> FirstName: {UserInfo.firstName}</Text>
        <Text> LastName: {UserInfo.lastName}</Text>
        <Text> Email: {UserInfo.email}</Text>

        {(UserInfo.userType == 'driver') ? (
          <View>
            <Text> PricePerKilometer: {UserInfo.pricePerKilometer}</Text>
            <Text> ServiceKind: {UserInfo.serviceKind}</Text>
            <Text> ManufactureYear: {UserInfo.manufactureYear}</Text>
            <Text> Color: {UserInfo.color}</Text>
            <Text> CarModel: {UserInfo.carModel}</Text>
            <Text> NumberOfSeats: {UserInfo.numberOfSeats}</Text>
          </View>
        ) : (null) }

        <Button
          style={styles.btn}
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
});
