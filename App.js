import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

import Login from './screens/Login';
import Home from './screens/Home';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SingleChat from './screens/SingleChat';
import GroupChat from './screens/GroupChat';

const Stack = createStackNavigator();
export default function App() {
  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SingleChat" component={SingleChat} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
      </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
