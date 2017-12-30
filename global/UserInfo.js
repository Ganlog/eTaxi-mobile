import { AsyncStorage } from 'react-native';

export default {
  username: null,
  email: null,
  token: null,

  storeParam: function(param, value){
    AsyncStorage.setItem(param, value);
    this[param] = value;
  },

  eraseInfo: function(){
    AsyncStorage.removeItem('username');
    this.username = null;
    AsyncStorage.removeItem('email');
    this.email = null;
    AsyncStorage.removeItem('token');
    this.token = null;
  },

  getParamsOnLoad: function(){
    AsyncStorage.getItem("username").then((value) => { this.username = value; });
    AsyncStorage.getItem("email").then((value) => { this.email = value; });
    AsyncStorage.getItem("token").then((value) => { this.token = value; });
  },
}
