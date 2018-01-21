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
    ScreenNavigation.setNavigate(this.props.navigation);

    if(!UserInfo.username)
      ScreenNavigation.goto('l_ChoiceScreen');


    this.state = {
      instruction: 'Please select your current location',
      yourLocation: null,
      confirmYourLocationBtn: false,
      removeYourLocationBtn: false,
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


    var sock = new SockJS('ws://85.255.11.29:8080/ws');
    sock.onopen = function() {
        console.log('open');
        sock.send('test');
    };

    sock.onmessage = function(e) {
        console.log('message', e.data);
        sock.close();
    };

    sock.onclose = function() {
        console.log('close');
    };


      // ws = webstomp.over( new WebSocket('ws://85.255.11.29:8080/ws'));
      //
      // ws.connect({}, function(frame) {
    	// 	ws.subscribe('/user/queue/errors', function(message) {
    	// 		alert('Socket error ' + message.body);
    	// 	});
      //
    	// 	ws.subscribe('/user/queue/reply', function(message) {
      //     console.log(message.body);
    	// 	});
      //
      //   var data = JSON.stringify({
      // 		'name' : $('#name').val()
      // 	})
      // 	ws.send('/message', {}, data);
      //
    	// }, function(error) {
    	// 	alert('STOMP error ' + error);
      //   console.log(error);
    	// });
  }


  componentWillReceiveProps(props){
    if(!UserInfo.locationTagID){
      this.setState({
        instruction: 'Please select your current location',
        yourLocation: null,
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
    if(props.navigation.state.params.selectedDriver)
      this.setState({
        instruction: 'Waiting for driver to accept...',
      });
    else
      this.setState({
        instruction: 'Please select your current location',
      });
  }


  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };


  _handlePress = press => {
    if(!this.state.yourLocation){
      let locationTag = {
        title: 'Your location',
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
      instruction: 'Please confirm selected location',
      confirmYourLocationBtn: true,
    });
  }


  _fixLatOrLng(latOrlng){
    latOrlng = Number(latOrlng).toFixed(6).toString();
    if(latOrlng[8] === '0')
      latOrlng = latOrlng.substring(0,8)+1;
    return Number(latOrlng);
  }


  _confirmLocation(){
    if(UserInfo.locationTagID){
      fetch('http://85.255.11.29:8080/api/v1/geotags/'+UserInfo.locationTagID, {
        method: 'DELETE',
        headers: {
          Authorization: 'Basic '+UserInfo.token
        }
      })
    }
    let data = {
      name: 'LOCATION',
      latitude: this._fixLatOrLng(this.state.yourLocation.latlng.latitude),
      longitude: this._fixLatOrLng(this.state.yourLocation.latlng.longitude)
    }
    fetch('http://85.255.11.29:8080/api/v1/geotags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic '+UserInfo.token
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      UserInfo.storeParam('locationTagID', responseJson.id.toString());
      this.setState({
        instruction: (UserInfo.userType == 'driver') ? 'Waiting for user to choose your offer...' : 'Select driver of your choice and confirm',
        confirmYourLocationBtn: false,
        removeYourLocationBtn: true,
      });
      if(UserInfo.userType != 'driver'){
        this._loadAllDriversLocations();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }


  _removeLocation(){
    fetch('http://85.255.11.29:8080/api/v1/geotags/'+UserInfo.locationTagID, {
      method: 'DELETE',
      headers: {
        Authorization: 'Basic '+UserInfo.token
      }
    })
    UserInfo.storeParam('locationTagID', null);
    this.setState({
      instruction: 'Please select your current location',
      yourLocation: null,
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
      for (i in tags){
        if(tags[i].user.role[0].role == 'DRIVER_USER'){
          let tag = {
            title: tags[i].user.firstName + ' ' + tags[i].user.lastName,
            description: 'Click for more info',
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
          <Text style={styles.titleText}>{(UserInfo.userType) ? UserInfo.userType.capitalize() : ''} Panel</Text>
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

          {(this.state.confirmYourLocationBtn) ? (
            <Button
              onPress={() => this._confirmLocation() }
              title='Confirm your location'
              color={Colors.tintColor}
            />
          ) : (null) }
          {(this.state.removeYourLocationBtn) ? (
            <Button
              onPress={() => this._removeLocation() }
              title='Remove your location'
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
