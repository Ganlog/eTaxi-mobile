import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
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
          <Text style={styles.titleText}>Twój profil {(UserInfo.userType == 'driver') ? ('kierowcy') : (UserInfo.userType == 'user') ? ('pasażera') : UserInfo.userType }</Text>
        </View>

        <Text><Text style={styles.bold}> Login: </Text> {UserInfo.username}</Text>
        <Text><Text style={styles.bold}> Imię: </Text> {UserInfo.firstName}</Text>
        <Text><Text style={styles.bold}> Nazwisko: </Text> {UserInfo.lastName}</Text>
        <Text><Text style={styles.bold}> Email: </Text> {UserInfo.email}</Text>

        {(UserInfo.userType == 'driver') ? (
          <View>
            <Text><Text style={styles.bold}> Cena za kilometr: </Text> {UserInfo.pricePerKilometer}</Text>
            <Text><Text style={styles.bold}> Rodaj usługi: </Text> {UserInfo.serviceKind}</Text>
            <Text><Text style={styles.bold}> Rok produkcji samochodu: </Text> {UserInfo.manufactureYear}</Text>
            <Text><Text style={styles.bold}> Kolor: </Text> {UserInfo.color}</Text>
            <Text><Text style={styles.bold}> Model samochodu: </Text> {UserInfo.carModel}</Text>
            <Text><Text style={styles.bold}> Liczba siedzeń: </Text> {UserInfo.numberOfSeats}</Text>
          </View>
        ) : (null) }

        <View style={{ height: 15 }} />
        <Button
          onPress={() => this._logout() }
          title='Wyloguj się'
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
