import HomeScreen from '../Containers/HomeScreen';
import LoginScreen from '../Containers/LoginScreen';
import SignUpScreen from '../Containers/SignupScreen';
import {ScreenName} from '../utils/constants';

export const NavigationData = [
  {name: ScreenName.LOGIN_SCREEN, component: LoginScreen},
  {name: ScreenName.SING_UP_SCREEN, component: SignUpScreen},

];
export const AuthData = [{name: ScreenName.HOME_SCREEN, component: HomeScreen}];
