import React from 'react';
import { AsyncStorage, Image, ScrollView, Dimensions, StyleSheet, Text, View, Button, InteractionManager, TextInput, Keyboard } from 'react-native';
import { MapView } from 'expo';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';
import SockJS from 'socket.io-client';

// import webstomp from 'webstomp-client';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      driverInfo: null
    }
  }


  componentWillReceiveProps(props){
    this.setState({
      driverInfo: props.navigation.state.params.driverInfo
    });
  }

  _selectDriver(){
    ScreenNavigation.goto('HomeScreen', {selectedDriver: this.state.driverInfo.id});
  }

  _goBack(){
    ScreenNavigation.goto('HomeScreen', {selectedDriver: null});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Informations about driver</Text>
        </View>
        {(this.state.driverInfo) ? (
          <View>
            <Text><Text style={styles.bold}> First name: </Text> {this.state.driverInfo.firstName}</Text>
            <Text><Text style={styles.bold}> Last name: </Text> {this.state.driverInfo.lastName}</Text>
            <Text><Text style={styles.bold}> Email: </Text> {this.state.driverInfo.email}</Text>
            <Text><Text style={styles.bold}> Price per kilometer: </Text> {this.state.driverInfo.pricePerKilometer}</Text>
            <Text><Text style={styles.bold}> Kind of service: </Text> {this.state.driverInfo.serviceKind}</Text>
            <Text><Text style={styles.bold}> Car manufacture year: </Text> {this.state.driverInfo.manufactureYear}</Text>
            <Text><Text style={styles.bold}> Color: </Text> {this.state.driverInfo.color}</Text>
            <Text><Text style={styles.bold}> Car Model: </Text> {this.state.driverInfo.carModel}</Text>
            <Text><Text style={styles.bold}> Number of Seats: </Text> {this.state.driverInfo.numberOfSeats}</Text>
          </View>
        ) : (null) }

        <View style={{ height: 15 }} />
        <Button
          onPress={() => this._selectDriver() }
          title='Select this driver'
          color={Colors.tintColor}
        />
        <View style={{ height: 15 }} />
        <Button
          onPress={() => this._goBack() }
          title='Choose another driver'
          color={Colors.userColor}
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
