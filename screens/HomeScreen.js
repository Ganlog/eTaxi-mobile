import React from 'react';
import { Dimensions, StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { MapView } from 'expo';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';
import Socket from 'socket.io-client';
import webstomp from 'webstomp-client';



export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    console.ignoredYellowBox = ['Setting a timer'];
    super(props);
    ScreenNavigation.setNavigate(this.props.navigation);

    if(!UserInfo.username)
      ScreenNavigation.goto('l_ChoiceScreen');

    this.state = {
      instruction: 'Podaj swoja przyblizoną lokalizację',
      yourLocation: 'block',
      receiverUser: '',
      isConnected: false,
      socketSessionId: '',
      confirmYourLocationBtn: false,
      removeYourLocationBtn: false,
      socketSessionId: null,
      mapRegion: {
        latitude: 50.0686919,
        longitude: 19.9433782,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: []
    }

    String.prototype.capitalize = function() {
      return this && this[0].toUpperCase() + this.slice(1);
    }
  }









  componentWillReceiveProps(props){
    if(!UserInfo.selectedLocation){
      this.setState({
        instruction: 'Podaj swoja przybliżoną lokalizację',
        yourLocation: 'block',
        confirmYourLocationBtn: false,
        removeYourLocationBtn: false,
        mapRegion: {
          latitude: 50.0686919,
          longitude: 19.9433782,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        markers: []
      })
    }
    if(props.navigation.state.params.selectedDriver){
      let driverSocketID = props.navigation.state.params.selectedDriver
      this.socket.emit('taxiOrderRequest', {
        receiverUser: driverSocketID,
        latitude: this._fixLatOrLng(this.state.yourLocation.latlng.latitude),
        longitude: this._fixLatOrLng(this.state.yourLocation.latlng.longitude)
      });
      this.setState({
        instruction: 'Kierowca otrzymał twoją ofertę i zmierza w twoim kierunku',
      });
    }
  }









  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _handlePress = press => {
    if(!this.state.yourLocation){
      let locationTag = {
        title: 'Twoja lokalizacja',
        draggable: true,
        color: (UserInfo.userType == 'driver') ? Colors.tintColor : '#4267B2',
        latlng: {
          latitude: press.nativeEvent.coordinate.latitude,
          longitude: press.nativeEvent.coordinate.longitude
        },
      }

      this.state.markers.push(locationTag);
      this.setState({
        yourLocation: locationTag,
        confirmYourLocationBtn: true,
      });
    }
  };

  _handleDragEnd = drag => {
    let locationTag = {
      latlng: {
        latitude: drag.nativeEvent.coordinate.latitude,
        longitude: drag.nativeEvent.coordinate.longitude
      },
    }

    this.setState({
      yourLocation: locationTag,
      instruction: 'Potwierdź zaznaczoną lokalizację',
      confirmYourLocationBtn: true,
    });
  }

  _fixLatOrLng(latOrlng){
    latOrlng = Number(latOrlng).toFixed(6).toString();
    if(latOrlng[8] === '0')
      latOrlng = latOrlng.substring(0,8)+1;
    return Number(latOrlng);
  }









  _enableToChooseLocation(){
    this.socket = Socket('http://85.255.11.29:3001', {pingTimeout: 3000});
    this.socket.on('recConnectionID', (data) => {
      this.setState({
        socketSessionId: data
      });
    });
    this.setState({
      yourLocation: null,
      isConnected: true
    });

    this.socket.on('topicReply', (data) => {
      console.log('topicReply');
      console.log(data);
    });
    this.socket.on('userQueueDriverConfirmation', (data) => {
      let passenger = JSON.parse(data.body);
      console.log(passenger.passengerId);
      if(passenger.passengerId){
        let tag = {
          title: 'Twój pasażer',
          draggable: false,
          color: '#4267B2',
          latlng: {
            latitude: passenger.localization.latitude,
            longitude: passenger.localization.longitude
          },
        }
        this.state.markers.push(tag);
        this.setState({
          instruction: 'Pasażer wybrał twoją ofertę. Jego lokalizacja pojawiła się na mapie'
        });
      }
    });
    this.socket.on('userQueuePassenger', (data) => {
      console.log('userQueuePassenger');
      console.log(data);
    });
    this.socket.on('userQueueErrors', (data) => {
      console.log('userQueueErrors');
      console.log(data);
    });
  }

  _confirmLocation(){
    this.socket.emit('taxiActivate', {
      id: UserInfo.id,
      socketSessionId: this.state.socketSessionId,
      latitude: this._fixLatOrLng(this.state.yourLocation.latlng.latitude),
      longitude: this._fixLatOrLng(this.state.yourLocation.latlng.longitude)
    });
    UserInfo.storeParam('selectedLocation', 'true');

    this.setState({
      instruction: (UserInfo.userType == 'driver') ? 'Oczekiwanie na akceptacje oferty przez pasażera...' : 'Zaznacz wybranego kierowcę i potwierdź wybór',
      confirmYourLocationBtn: false,
      removeYourLocationBtn: true,
    });
    if(UserInfo.userType != 'driver'){
      this._loadAllDriversLocations();
    }
  }

  _removeLocation(){
    this.socket.emit('taxiDeactivate', {
      id: UserInfo.id,
      socketSessionId: this.state.socketSessionId
    });
    UserInfo.storeParam('selectedLocation', null);
    this.socket.close();
    this.setState({
      instruction: 'Podaj swoja przyblizoną lokalizację',
      yourLocation: 'block',
      confirmYourLocationBtn: false,
      removeYourLocationBtn: false,
      markers: []
    });
  }

  _loadAllDriversLocations(){
    fetch('http://85.255.11.29:8080/api/v1/geotags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic '+UserInfo.token
      },
    })
    .then((response) => response.json())
    .then((tags) => {
      console.log(tags);
      for (i in tags){
        if(tags[i].user.role[0].role == 'DRIVER_USER'){
          let tag = {
            title: tags[i].user.firstName + ' ' + tags[i].user.lastName,
            description: 'Wyświetl więcej informacji',
            driverInfo: tags[i].user,
            draggable: false,
            color: Colors.tintColor,
            latlng: {
              latitude: tags[i].latitude,
              longitude: tags[i].longitude
            },
          }
          this.state.markers.push(tag);
        }
        this.setState({
          refresh: true,
        });
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }

  _ShowDriverDetails(driverInfo){
    ScreenNavigation.goto('DriverDetails', {driverInfo: driverInfo});
  }







  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Panel {(UserInfo.userType == 'driver') ? ('Kierowcy') : (UserInfo.userType == 'user') ? ('Pasażera') : UserInfo.userType} </Text>
          <Text style={styles.instruction}> {this.state.instruction} </Text>
        </View>
        <ScrollView>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
              onPress={this._handlePress}
            >
            {this.state.markers.map((marker, i) => {
                return <MapView.Marker
                  draggable={marker.draggable}
                  pinColor={marker.color}
                  onCalloutPress={ e => {if(marker.driverInfo) this._ShowDriverDetails(marker.driverInfo)} }
                  key={i}
                  coordinate={marker.latlng}
                  onDragEnd={(e) => { marker.latlng = e.nativeEvent.coordinate; this._handleDragEnd(e); }}
                  title={marker.title}
                  description={marker.description}
                />
              })}
            </MapView>
          </View>

          {(this.state.yourLocation == 'block') ? (
            <Button
              onPress={() => this._enableToChooseLocation() }
              title='Kliknij tu jeśli chcesz podać swoją lokalizacje'
              color={Colors.tintColor}
            />
          ) : (null) }

          {(this.state.confirmYourLocationBtn) ? (
            <Button
              onPress={() => this._confirmLocation() }
              title='Potwierdź swoją lokalizacje'
              color={Colors.tintColor}
            />
          ) : (null) }
          {(this.state.removeYourLocationBtn) ? (
            <Button
              onPress={() => this._removeLocation() }
              title='Usuń swoją lokalizacje'
              color={'red'}
            />
          ) : (null) }

        </ScrollView>
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
  },
  titleText: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    alignSelf: 'stretch',
    height: 390,
    width: Dimensions.get('window').width-10,
    flex: 1
  },
  mapContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  instruction: {
    fontWeight:'bold',
    textAlign: 'center'
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    height: 30,
    borderWidth: 1
  },
});
