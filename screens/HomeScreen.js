import React from 'react';
import { AsyncStorage, Image, ScrollView, Dimensions, StyleSheet, Text, View, Button, InteractionManager, TextInput, Keyboard } from 'react-native';
import { MapView } from 'expo';
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
    	// 	ws.subscribe("/user/queue/errors", function(message) {
    	// 		alert("Socket error " + message.body);
    	// 	});
      //
    	// 	ws.subscribe("/user/queue/reply", function(message) {
      //     console.log(message.body);
    	// 	});
      //
      //   var data = JSON.stringify({
      // 		'name' : $("#name").val()
      // 	})
      // 	ws.send("/message", {}, data);
      //
    	// }, function(error) {
    	// 	alert("STOMP error " + error);
      //   console.log(error);
    	// });


    if(!UserInfo.username)
      ScreenNavigation.goto('l_ChoiceScreen');

    this.state = {
      instruction: 'Provide name and optional description of your location and then place proper tag on map',
      mapRegion: {
        latitude: 50.0686919,
        longitude: 19.9433782,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: []
    };
  }


  componentWillReceiveProps(props){
    console.log(props);
  }


  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };


  _handlePress = press => {
    if(!this.yourLocation){
      let locationTag = {
        title: 'Your location',
        latlng: {
          latitude: press.nativeEvent.coordinate.latitude,
          longitude: press.nativeEvent.coordinate.longitude
        },
      }
      this.yourLocation = locationTag
      this.state.markers.push(locationTag);
    }
    this.setState({ press });
  };









  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <Text style={styles.titleText}>{(UserInfo.userType) ? UserInfo.userType.capitalize() : ''} Panel</Text>

          <Text style={styles.instruction}> {this.state.instruction} </Text>
          <TextInput
            style={styles.input}
            onChangeText={locationName => this.setState({locationName})}
            placeholder='Location Name'
            returnKeyType='done'
            blurOnSubmit={true}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextInput
            style={styles.input}
            onChangeText={locationDescription => this.setState({locationDescription})}
            placeholder='Location Description'
            returnKeyType='done'
            blurOnSubmit={true}
            onSubmitEditing={Keyboard.dismiss}
          />

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
              onPress={this._handlePress}
            >
            {this.state.markers.map(function(marker, i){
                return <MapView.Marker draggable
                  pinColor='#FFD954'
                  key={i}
                  coordinate={marker.latlng}
                  onDragEnd={(e) => { marker.latlng = e.nativeEvent.coordinate }}
                  title={marker.title}
                  description={marker.description}
                />
              })}
            </MapView>
          </View>






        </ScrollView>
      </View>
    );
  }
}









const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    alignSelf: 'stretch',
    height: 300,
    width: Dimensions.get('window').width-10,
    flex: 1
  },
  contentContainer: {
    paddingTop: 5,
  },
  titleText: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
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
