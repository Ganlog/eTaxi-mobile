import React from 'react';
import { Keyboard, ActivityIndicator, ScrollView, Button, StyleSheet, ListView, Text, TextInput, View, KeyboardAvoidingView, Picker } from 'react-native';
import Colors from '../constants/Colors';
import UserInfo from '../global/UserInfo';
import Encript from '../global/Encript';
import ScreenNavigation from '../global/ScreenNavigation';

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
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
    console.log({ username: username, firstName: firstName, lastName: lastName, email: email, password: password, matchingPassword: matchingPassword, pricePerKilometer: pricePerKilometer, serviceKind: serviceKind, manufactureYear: manufactureYear, color: color, carModel: carModel, numberOfSeats: numberOfSeats });
    return fetch('http://85.255.11.29:8080/api/v1/users/'+this.state.userType+'Register', {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, firstName: firstName, lastName: lastName, email: email, password: password, matchingPassword: matchingPassword, pricePerKilometer: pricePerKilometer, serviceKind: serviceKind, manufactureYear: manufactureYear, color: color, carModel: carModel, numberOfSeats: numberOfSeats }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
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
          errors: [],
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
        UserInfo.storeParam('token', Encript.btoa(this.state.username+':'+this.state.password));
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
          regRespText: 'Successfully registered',
          isLoading: false,
          errors: [],
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
    ScreenNavigation.goto('HomeScreen', {selectedDriver: null});
  }









  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.header}>
          <Text style={styles.titleText}>Register as a {this.state.userType}</Text>
          {this.state.isLoading ? ( <ActivityIndicator/> ) : (null)}
        </View>
        <ScrollView>

          <Text style={styles.inputHeader}>Choose username:</Text>
          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['UsernameInput'] = input; }}
            onChangeText={username => this.setState({username})}
            placeholder='Username'
            returnKeyType='next'
            autoCapitalize='none'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('EmailInput'); }}
          />
          {this.state.errors.username ? (<Text style={styles.error}>Username {this.state.errors.username}</Text>) : (null)}

          <Text style={styles.inputHeader}>Enter email:</Text>
          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['EmailInput'] = input; }}
            onChangeText={email => this.setState({email})}
            placeholder='email@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            returnKeyType='next'
            blurOnSubmit={false}
            onSubmitEditing={() => { this._focusNextField('FirstNameInput'); }}
          />
          {this.state.errors.email ?(<Text style={styles.error}>Email {this.state.errors.email}</Text>) : (null)}

          <Text style={styles.inputHeader}>Enter first and last name:</Text>
          <View style={styles.flexContainer}>
            <View style={{flexDirection:'row'}}>
              <TextInput
                style={{flex:0.5, height: 30, padding: 5}}
                ref={ input => { this.inputs['FirstNameInput'] = input; }}
                onChangeText={firstName => this.setState({firstName})}
                placeholder='First Name'
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => { this._focusNextField('LastNameInput'); }}
              />

              <TextInput
                style={{flex:0.5, height: 30, padding: 5}}
                ref={ input => { this.inputs['LastNameInput'] = input; }}
                onChangeText={lastName => this.setState({lastName})}
                placeholder='Last Name'
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => { (this.state.userType == 'driver') ? (this._focusNextField('CarModelInput')) : (this._focusNextField('PasswordInput')) }}
              />

            </View>
          </View>
          {this.state.errors.firstName ? (<Text style={styles.error}>First Name {this.state.errors.firstName}</Text>) : (null)}
          {this.state.errors.lastName ? (<Text style={styles.error}>Last Name {this.state.errors.lastName}</Text>) : (null)}



          {(this.state.userType == 'driver') ? (<View>


                <Text style={styles.inputHeader}>Enter informations about car:</Text>
                  <View style={styles.flexContainer}>
                    <View style={{flexDirection:'row'}}>

                        <TextInput
                          style={{flex:0.5, height: 30, padding: 5}}
                          ref={ input => { this.inputs['CarModelInput'] = input; }}
                          onChangeText={carModel => this.setState({carModel})}
                          placeholder='Car model'
                          returnKeyType='next'
                          blurOnSubmit={false}
                          onSubmitEditing={() => { this._focusNextField('ManufactureYearInput'); }}
                        />


                        <TextInput
                          style={{flex:0.5, height: 30, padding: 5}}
                          ref={ input => { this.inputs['ManufactureYearInput'] = input; }}
                          onChangeText={manufactureYear => this.setState({manufactureYear})}
                          placeholder='Car manufacture year'
                          keyboardType='numeric'
                          returnKeyType='next'
                          blurOnSubmit={false}
                          onSubmitEditing={() => { this._focusNextField('ColorInput'); }}
                        />

                    </View>
                  </View>

                  <View style={styles.flexContainer}>
                    <View style={{flexDirection:'row'}}>
                        <TextInput
                          style={{flex:0.5, height: 30, padding: 5}}
                          ref={ input => { this.inputs['ColorInput'] = input; }}
                          onChangeText={color => this.setState({color})}
                          placeholder='Car color'
                          autoCapitalize='none'
                          returnKeyType='next'
                          blurOnSubmit={false}
                          onSubmitEditing={() => { this._focusNextField('NumberOfSeatsInput'); }}
                        />

                        <TextInput
                          style={{flex:0.5, height: 30, padding: 5}}
                          ref={ input => { this.inputs['NumberOfSeatsInput'] = input; }}
                          onChangeText={numberOfSeats => this.setState({numberOfSeats})}
                          placeholder='Number of seats in car'
                          keyboardType='numeric'
                          returnKeyType='next'
                          blurOnSubmit={false}
                          onSubmitEditing={() => { this._focusNextField('PricePerKilometerInput'); }}
                        />

                    </View>
                  </View>
                    {(this.state.errors.carModel) ? (<Text style={styles.error}>Car model {this.state.errors.carModel}</Text>) : (null)}
                    {(this.state.errors.manufactureYear) ? (<Text style={styles.error}>Car manufacture year {this.state.errors.manufactureYear}</Text>) : (null)}
                    {(this.state.errors.color) ? (<Text style={styles.error}>Car color {this.state.errors.color}</Text>) : (null)}
                    {(this.state.errors.numberOfSeats) ? (<Text style={styles.error}>Number of seats {this.state.errors.numberOfSeats}</Text>) : (null)}


                  <Text style={styles.inputHeader}>Enter service type and price:</Text>

                  <View style={styles.flexContainer}>
                    <View style={{flexDirection:'row'}}>

                      <Picker
                        style={{flex:0.52, height: 30, padding: 5}}
                        selectedValue={this.state.serviceKind}
                        onValueChange={(itemValue, itemIndex) => this.setState({serviceKind: itemValue})}>
                        <Picker.Item label='Premium' value='PREMIUM' />
                        <Picker.Item label='Standard' value='STANDARD' />
                      </Picker>

                      <TextInput
                        style={{flex:0.34, height: 30, padding: 5}}
                        ref={ input => { this.inputs['PricePerKilometerInput'] = input; }}
                        onChangeText={pricePerKilometer => this.setState({pricePerKilometer})}
                        placeholder='Price per kilometer'
                        keyboardType='numeric'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this._focusNextField('PricePerKilometerInput2'); }}
                      />

                      <Text style={{height: 30, lineHeight: 30}}>.</Text>

                      <TextInput
                        style={{flex:0.14, height: 30, padding: 5}}
                        ref={ input => { this.inputs['PricePerKilometerInput2'] = input; }}
                        onChangeText={pricePerKilometer2 => this.setState({pricePerKilometer2})}
                        placeholder='decimal'
                        keyboardType='numeric'
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this._focusNextField('PasswordInput'); }}
                      />

                    </View>
                  </View>
                  {(this.state.errors.pricePerKilometer) ? (<Text style={styles.error}>Price per kilometer {this.state.errors.pricePerKilometer}</Text>) : (null)}


          </View>) : (null) }




          <Text style={styles.inputHeader}>Enter password:</Text>
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
          {this.state.errors.password ? (<Text style={styles.error}>Password {this.state.errors.password}</Text>) : (null)}


          <TextInput
            style={styles.input}
            ref={ input => { this.inputs['MatchPassInput'] = input; }}
            onChangeText={matchingPassword => this.setState({matchingPassword})}
            placeholder='Repeat password'
            autoCapitalize='none'
            returnKeyType={ (this.state.userType == 'user') ? 'done' : 'next' }
            secureTextEntry={true}
            blurOnSubmit={true}
          />
          {(this.state.errors.userDTO || this.state.errors.driverDTO) ? (
            (this.state.userType == 'user') ? (<Text style={styles.error}>{this.state.errors.userDTO}</Text>) : (<Text style={styles.error}>{this.state.errors.driverDTO}</Text>)
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
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  flexContainer: {
    flex:1,
    justifyContent:'flex-end',
    marginLeft: 15,
    marginRight: 15,
    height: 30,
  },
  inputHeader: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5,
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 0,
    padding: 5,
    height: 30
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  alignCenter: {
    textAlign: 'center',
  },
});
