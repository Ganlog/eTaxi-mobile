import React from 'react';
import { ScrollView, StyleSheet, View, Text, Platform } from 'react-native';
import Colors from '../constants/Colors';

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }


  componentWillReceiveProps(props){
  }




  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>O aplikacji</Text>
        </View>
        <ScrollView style={styles.container}>
          <Text style={styles.infoTextHead}>Aplikacja służy do łączenia taksówkarzy z ich klientami</Text>
          <Text style={styles.infoText}>Pasażerom pozwala w wygodniu sposób przejrzeć oferty dostępnych taksówkarzy i wybrać najbardziej odpowiednią</Text>
          <Text style={styles.infoText}>Kierowcom pozwala bez wysiłku znaleźć klientów dla świadczonych przez nich usług</Text>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>Jeśli znajdziesz w aplikacji błąd zgłoś go na email</Text>
          <Text style={styles.tabBarInfoText}>etaxi.kontakt@gmail.com</Text>
        </View>
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
  infoTextHead: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },
  infoText: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
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
