import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, Home, Survey, Intial, Result, UserSelection} from '../screens';

const Stack = createStackNavigator();
export const navigationRef = React.createRef();
const RouterComponent = () => {
  const onNavigationStateChange = () => {
    const currentRouteName = navigationRef.current.getCurrentRoute().name;
    console.log(
      '**************currentRouteName*************',
      currentRouteName,
    );
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={onNavigationStateChange}>
      <Stack.Navigator>
        <Stack.Screen
          name="Inital"
          component={Intial}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Survey"
          component={Survey}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{headerShown: false, gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RouterComponent;
