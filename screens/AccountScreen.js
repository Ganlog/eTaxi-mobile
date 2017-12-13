import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class AccountScreen extends React.Component {
  static navigationOptions = {
    title: 'User Account',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
      {
        <Text style={styles.alignCenter}>Hello User</Text>
      }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  alignCenter: {
    marginTop: 20,
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
});
