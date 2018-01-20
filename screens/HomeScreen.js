import React from 'react';
import { AsyncStorage, Image, ScrollView, Dimensions, StyleSheet, Text, View, Button, InteractionManager } from 'react-native';
import { MapView } from 'expo';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';
import webstomp from 'webstomp-client';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);
    ScreenNavigation.setNavigate(this.props.navigation);

      options = {debug: false, protocols: webstomp.VERSIONS.supportedProtocols()};
      login = 'guest', password = 'guest',
      user = "test";

      ws = webstomp.over( new WebSocket('ws://85.255.11.29:8080/ws'));

      ws.connect({}, function(frame) {
    		ws.subscribe("/user/queue/errors", function(message) {
    			alert("Socket error " + message.body);
    		});

    		ws.subscribe("/user/queue/reply", function(message) {
          console.log(message.body);
    		});

        var data = JSON.stringify({
      		'name' : $("#name").val()
      	})
      	ws.send("/message", {}, data);

    	}, function(error) {
    		alert("STOMP error " + error);
        console.log(error);
    	});


    if(!UserInfo.username)
      ScreenNavigation.goto('l_ChoiceScreen');
  }

  state = {
    mapRegion: {
      latitude: 50.0686919,
      longitude: 19.9433782,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    markers: [{
      title: 'hello',
      description: 'hhh',
      latlng: {
        latitude: 50.0686919,
        longitude: 19.9433782
      },
    }]
  };


  componentWillReceiveProps(props){
    console.log(props);
  }


  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };


  _handlePress = press => {
    UserInfo.storeParam('username', ('k'+Math.floor(Math.random() * 100) + 1));
    this.state.markers.push(
      {
        title: 'hello',
        description: 'hhh',
        latlng: {
          latitude: press.nativeEvent.coordinate.latitude,
          longitude: press.nativeEvent.coordinate.longitude
        },
      });
  };


  _developmentModeWarning() {
    if (__DEV__) {
      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. Shake your phone to enable them (for example element inspector).
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  };









  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/dev.png')
                  : require('../assets/images/prod.png')
              }
              style={styles.welcomeImage}
            />
            {this._developmentModeWarning()}
          </View>


          <View style={styles.mapContainer}>
            <MapView
              style={{ alignSelf: 'stretch', height: 300, width: Dimensions.get('window').width, flex: 1 }}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
              onPress={this._handlePress}
            >
            {this.state.markers.map(function(marker, i){
                return <MapView.Marker draggable
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
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  mapContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
