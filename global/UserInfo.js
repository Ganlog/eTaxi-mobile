import { AsyncStorage } from 'react-native';

export default {
  id: null,
  token: null,
  userType: null,
  avatar: null,
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  pricePerKilometer: null,
  serviceKind: null,
  manufactureYear: null,
  color: null,
  carModel: null,
  numberOfSeats: null,
  selectedLocation: null,

  storeParam: function(param, value){
    AsyncStorage.setItem(param, value);
    this[param] = value;
  },

  eraseInfo: function(){
    AsyncStorage.removeItem('id');
    this.id = null;
    AsyncStorage.removeItem('token');
    this.token = null;
    AsyncStorage.removeItem('userType');
    this.userType = null;
    AsyncStorage.removeItem('avatar');
    this.avatar = null;
    AsyncStorage.removeItem('username');
    this.username = null;
    AsyncStorage.removeItem('firstName');
    this.firstName = null;
    AsyncStorage.removeItem('lastName');
    this.lastName = null;
    AsyncStorage.removeItem('email');
    this.email = null;
    AsyncStorage.removeItem('pricePerKilometer');
    this.pricePerKilometer = null;
    AsyncStorage.removeItem('serviceKind');
    this.serviceKind = null;
    AsyncStorage.removeItem('manufactureYear');
    this.manufactureYear = null;
    AsyncStorage.removeItem('color');
    this.color = null;
    AsyncStorage.removeItem('carModel');
    this.carModel = null;
    AsyncStorage.removeItem('numberOfSeats');
    this.numberOfSeats = null;
    AsyncStorage.removeItem('selectedLocation');
    this.selectedLocation = null;
  },

  getParamsOnLoad: function(){
    AsyncStorage.getItem('id').then((value) => { this.id = value; });
    AsyncStorage.getItem('token').then((value) => { this.token = value; });
    AsyncStorage.getItem('userType').then((value) => { this.userType = value; });
    AsyncStorage.getItem('avatar').then((value) => { this.avatar = value; });
    AsyncStorage.getItem('username').then((value) => { this.username = value; });
    AsyncStorage.getItem('firstName').then((value) => { this.firstName = value; });
    AsyncStorage.getItem('lastName').then((value) => { this.lastName = value; });
    AsyncStorage.getItem('email').then((value) => { this.email = value; });
    AsyncStorage.getItem('pricePerKilometer').then((value) => { this.pricePerKilometer = value; });
    AsyncStorage.getItem('serviceKind').then((value) => { this.serviceKind = value; });
    AsyncStorage.getItem('manufactureYear').then((value) => { this.manufactureYear = value; });
    AsyncStorage.getItem('color').then((value) => { this.color = value; });
    AsyncStorage.getItem('carModel').then((value) => { this.carModel = value; });
    AsyncStorage.getItem('numberOfSeats').then((value) => { this.numberOfSeats = value; });
    AsyncStorage.getItem('numberOfSeats').then((value) => { this.numberOfSeats = value; });
    AsyncStorage.getItem('selectedLocation').then((value) => { this.selectedLocation = value; });
  },
}
