import React from 'react';
import { ScrollView, StyleSheet, View, Text, Platform } from 'react-native';
import ScreenNavigation from '../global/ScreenNavigation';

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  constructor(props) {
    super(props);
  }


  componentWillReceiveProps(props){
    console.log(props);
  }




  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
        {
          // Informations about application
        }
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>If you see any bug please report it to:</Text>
          <Text style={styles.tabBarInfoText}>etaxi.kontakt@gmail.com</Text>
        </View>
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
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});
