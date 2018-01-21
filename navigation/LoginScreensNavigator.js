import HomeScreen from '../screens/HomeScreen';
import DriverDetails from '../screens/DriverDetails';
import l_ChoiceScreen from '../screens/l_ChoiceScreen';
import l_LoginScreen from '../screens/l_LoginScreen';
import l_RegisterScreen from '../screens/l_RegisterScreen';
import { TabNavigator } from 'react-navigation'; // 1.0.0-beta.27

export default LoginScreensNavigator = TabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    DriverDetails: {
      screen: DriverDetails,
      navigationOptions: () => ({ tabBarVisible: false }),
    },
    l_ChoiceScreen: {
      screen: l_ChoiceScreen,
      navigationOptions: () => ({ tabBarVisible: false }),
    },
    l_LoginScreen: {
      screen: l_LoginScreen,
      navigationOptions: () => ({ tabBarVisible: false }),
    },
    l_RegisterScreen: {
      screen: l_RegisterScreen,
      navigationOptions: () => ({ tabBarVisible: false }),
    },
  },
  {
    initialRouteName: 'HomeScreen',
    tabBarOptions: {
      style: {
        display: 'none',
      },
    },
    swipeEnabled: false,
  }
);
