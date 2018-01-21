import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View, KeyboardAvoidingView, Picker } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import ScreenNavigation from '../global/ScreenNavigation';

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register your account',
    headerStyle: {
     backgroundColor: Colors.tintColor
   },
  };


  constructor(props) {
    super(props);
    this._focusNextField = this._focusNextField.bind(this);
    this.inputs = {};
    this.state = {
      isLoading: false,
      errors: [],
      regRespText: null,
      regTokenReceived: null,
      registerSuccess: null,
      userType: null,
      username: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      matchingPassword: null,
      pricePerKilometer: 0,
      pricePerKilometer2: 0,
      serviceKind: 'STANDARD',
      manufactureYear: null,
      color: null,
      carModel: null,
      numberOfSeats: null,
    }
  }


  componentWillReceiveProps(props){
    this.state.userType = props.navigation.state.params.userType;
    console.log("dostalem");
  }

  _clearRegisterData(){
    this.setState({
      isLoading: false,
      errors: [],
      regRespText: null,
      regTokenReceived: null,
      registerSuccess: null,
    });

    this.inputs['UsernameInput'].clear();
    this.inputs['FirstNameInput'].clear();
    this.inputs['LastNameInput'].clear();
    this.inputs['EmailInput'].clear();
    this.inputs['PasswordInput'].clear();
    this.inputs['MatchPassInput'].clear();
    this.setState({
      username: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      matchingPassword: null,
    });

    if(this.state.userType == 'driver'){
      this.inputs['PricePerKilometerInput'].clear();
      this.inputs['PricePerKilometerInput2'].clear();
      this.inputs['ManufactureYearInput'].clear();
      this.inputs['ColorInput'].clear();
      this.inputs['CarModelInput'].clear();
      this.inputs['NumberOfSeatsInput'].clear();
      this.setState({
        pricePerKilometer: 0,
        pricePerKilometer2: 0,
        serviceKind: 'STANDARD',
        manufactureYear: null,
        color: null,
        carModel: null,
        numberOfSeats: null,
      });
    }
    this.state.userType = null;
  }


  _focusNextField(id) {
    this.inputs[id].focus();
  }


  _register(username, firstName, lastName, email, password, matchingPassword, pricePerKilometer, serviceKind, manufactureYear, color, carModel, numberOfSeats) {
    this.setState({ isLoading: true})
    return fetch('http://85.255.11.29:8080/api/v1/users/'+this.state.userType+'Register', {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, firstName: firstName, lastName: lastName, email: email, password: password, matchingPassword: matchingPassword, pricePerKilometer: pricePerKilometer, serviceKind: serviceKind, manufactureYear: manufactureYear, color: color, carModel: carModel, numberOfSeats: numberOfSeats }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errors){
        let error, errors={}, regRespText;
        for(let i in responseJson.errors){
          error = responseJson.errors[i].split(': ');
          errors[error[0]] = error[1];
        }
        if(responseJson.errors.length == 1)
          if(!responseJson.errors[0].includes(':'))
            regRespText = responseJson.errors[0];
        this.setState({
          errors: errors,
          regRespText: <Text style={styles.error}>{regRespText}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.message) {
        this.setState({
          regRespText: responseJson.message,
          regTokenReceived: responseJson.token,
          isLoading: false,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };


  _confirmRegistration(){
    this.setState({ isLoading: true})
    return fetch('http://85.255.11.29:8080/api/v1/users/registrationConfirm/'+this.state.regTokenReceived, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.errors){
        this.setState({
          regRespText: <Text style={styles.error}>{responseJson.errors}</Text>,
          isLoading: false,
        });
      }
      else if(responseJson.message) {
        if(responseJson.token)
          UserInfo.storeParam('token', responseJson.token);
        UserInfo.storeParam('userType', this.state.userType);
        UserInfo.storeParam('username', this.state.username);
        UserInfo.storeParam('firstName', this.state.firstName);
        UserInfo.storeParam('lastName', this.state.lastName);
        UserInfo.storeParam('email', this.state.email);

        if(this.state.userType == 'driver'){
          UserInfo.storeParam('pricePerKilometer', this.state.pricePerKilometer+'.'+this.state.pricePerKilometer2);
          UserInfo.storeParam('serviceKind', this.state.serviceKind.toLowerCase());
          UserInfo.storeParam('manufactureYear', this.state.manufactureYear);
          UserInfo.storeParam('color', this.state.color);
          UserInfo.storeParam('carModel', this.state.carModel);
          UserInfo.storeParam('numberOfSeats', this.state.numberOfSeats);
        }
        this.setState({
          regRespText: "Successfully registered",
          isLoading: false,
          registerSuccess: true
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };


  _openApplication(){
    this._clearRegisterData();
    ScreenNavigation.goto('HomeScreen');
  }









  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <ScrollView>
          <Text style={styles.titleText}>Register as a {this.state.userType}</Text>


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['UsernameInput'] = input; }}
            onChangeText={username => this.setState({username})}
            placeholder='Username'
            returnKeyType='next'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('FirstNameInput'); }}
          />
          {this.state.isLoading ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.username}</Text>)}


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['FirstNameInput'] = input; }}
            onChangeText={firstName => this.setState({firstName})}
            placeholder='First Name'
            returnKeyType='next'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('LastNameInput'); }}
          />
          {this.state.isLoading ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.firstName}</Text>)}


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['LastNameInput'] = input; }}
            onChangeText={lastName => this.setState({lastName})}
            placeholder='Last Name'
            returnKeyType='next'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('EmailInput'); }}
          />
          {this.state.isLoading ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.lastName}</Text>)}

          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['EmailInput'] = input; }}
            onChangeText={email => this.setState({email})}
            placeholder='email@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            returnKeyType='next'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('PasswordInput'); }}
          />
          {this.state.isLoading ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.email}</Text>)}


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['PasswordInput'] = input; }}
            onChangeText={password => this.setState({password})}
            placeholder='Password'
            autoCapitalize='none'
            returnKeyType='next'
            secureTextEntry={true}
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('MatchPassInput'); }}
          />
          {this.state.isLoading ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.password}</Text>)}


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['MatchPassInput'] = input; }}
            onChangeText={matchingPassword => this.setState({matchingPassword})}
            placeholder='Repeat password'
            autoCapitalize='none'
            returnKeyType={ (this.state.userType == 'user') ? 'done' : 'next' }
            secureTextEntry={true}
            blurOnSubmit={ (this.state.userType == 'user') ? true : false }
            onSubmitEditing={() => { (this.state.userType == 'user') ? (Keyboard.dismiss) : (this._focusNextField('PricePerKilometerInput')) }}
          />
          {this.state.isLoading ? (
            <ActivityIndicator/>
          ) : (
            (this.state.userType == 'user') ? (<Text style={styles.error}>{this.state.errors.userDTO}</Text>) : (<Text style={styles.error}>{this.state.errors.driverDTO}</Text>)
          )}


                {(this.state.userType == 'driver') ? (
                  <View style={{flex:1, justifyContent:'flex-end', marginLeft: 15, marginRight: 15, height: 40, borderWidth: 1}}>
                    <View style={{flexDirection:'row'}}>
                      <TextInput
                        style={{flex:0.5, height: 40, padding: 5}}
                        ref={ input => { this.inputs['PricePerKilometerInput'] = input; }}
                        onChangeText={pricePerKilometer => this.setState({pricePerKilometer})}
                        placeholder='Price per kilometer'
                        keyboardType='numeric'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this._focusNextField('PricePerKilometerInput2'); }}
                      />

                      <Text style={{height: 40, lineHeight: 40}}>.</Text>

                      <TextInput
                        style={{flex:0.5, height: 40, padding: 5}}
                        ref={ input => { this.inputs['PricePerKilometerInput2'] = input; }}
                        onChangeText={pricePerKilometer2 => this.setState({pricePerKilometer2})}
                        placeholder='decimal'
                        keyboardType='numeric'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this._focusNextField('ManufactureYearInput'); }}
                      />
                    </View>
                  </View>
                ) : (null) }
                {(this.state.userType == 'driver') ? (
                  (this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.pricePerKilometer}</Text>)
                ) : (null) }



                {(this.state.userType == 'driver') ? (
                  <TextInput
                    style={styles.input}
                    ref={ input => { this.inputs['ManufactureYearInput'] = input; }}
                    onChangeText={manufactureYear => this.setState({manufactureYear})}
                    placeholder='Car manufacture year'
                    keyboardType='numeric'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this._focusNextField('ColorInput'); }}
                  />
                ) : (null) }
                {(this.state.userType == 'driver') ? (
                  (this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.manufactureYear}</Text>)
                ) : (null) }


                {(this.state.userType == 'driver') ? (
                  <TextInput
                    style={styles.input}
                    ref={ input => { this.inputs['ColorInput'] = input; }}
                    onChangeText={color => this.setState({color})}
                    placeholder='Car color'
                    autoCapitalize='none'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this._focusNextField('CarModelInput'); }}
                  />
                ) : (null) }
                {(this.state.userType == 'driver') ? (
                  (this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.color}</Text>)
                ) : (null) }


                {(this.state.userType == 'driver') ? (
                  <TextInput
                    style={styles.input}
                    ref={ input => { this.inputs['CarModelInput'] = input; }}
                    onChangeText={carModel => this.setState({carModel})}
                    placeholder='Car model'
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this._focusNextField('NumberOfSeatsInput'); }}
                  />
                ) : (null) }
                {(this.state.userType == 'driver') ? (
                  (this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.carModel}</Text>)
                ) : (null) }


                {(this.state.userType == 'driver') ? (
                  <TextInput
                    style={styles.input}
                    ref={ input => { this.inputs['NumberOfSeatsInput'] = input; }}
                    onChangeText={numberOfSeats => this.setState({numberOfSeats})}
                    placeholder='Number of seats in car'
                    keyboardType='numeric'
                    returnKeyType='done'
                    blurOnSubmit={true}
                  />
                ) : (null) }
                {(this.state.userType == 'driver') ? (
                  (this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.error}>{this.state.errors.numberOfSeats}</Text>)
                ) : (null) }


                {(this.state.userType == 'driver') ? (
                  <View>
                    <Text>Kind of service:</Text>
                    <Picker
                      selectedValue={this.state.serviceKind}
                      onValueChange={(itemValue, itemIndex) => this.setState({serviceKind: itemValue})}>
                      <Picker.Item label='Premium' value='PREMIUM' />
                      <Picker.Item label='Standard' value='STANDARD' />
                    </Picker>
                  </View>
                ) : (null) }


          {(this.state.userType == 'user') ? (
            <Button
              onPress={() =>
                this._register(
                  this.state.username,
                  this.state.firstName,
                  this.state.lastName,
                  this.state.email,
                  this.state.password,
                  this.state.matchingPassword
                )
              }
              title='Register user'
              color={Colors.tintColor}
            />
          ) : (
            <Button
              onPress={() =>
                this._register(
                  this.state.username,
                  this.state.firstName,
                  this.state.lastName,
                  this.state.email,
                  this.state.password,
                  this.state.matchingPassword,
                  this.state.pricePerKilometer+'.'+this.state.pricePerKilometer2,
                  this.state.serviceKind,
                  this.state.manufactureYear,
                  this.state.color,
                  this.state.carModel,
                  this.state.numberOfSeats
                )
              }
              title='Register driver'
              color={Colors.tintColor}
            />
          )}

          {(this.state.isLoading) ? (<ActivityIndicator/>) : (<Text style={styles.alignCenter}>{this.state.regRespText}</Text>)}


          {this.state.regTokenReceived ? (
            <Button
              onPress={() => this._confirmRegistration()}
              title='Confirm registration'
              color={Colors.tintColor}
            />) : ( null )
          }

          {this.state.registerSuccess ? (
            <View>
              <View style={{margin: 5}} />
              <Button
                onPress={() => this._openApplication()}
                title='Open Application'
                color={Colors.tintColor}
              />
            </View>) : ( null )
          }
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}









const styles = StyleSheet.create({
  input: {
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    height: 30,
    borderWidth: 1
  },
  titleText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  alignCenter: {
    textAlign: 'center',
  },
});
