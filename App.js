import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useLinkTo } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Linking from 'expo-linking';

import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Settings from './src/screens/Settings';

/* npx uri-scheme open exp://127.0.0.1:19000/--/settings --ios */
/* npx uri-scheme open exp://127.0.0.1:19000/--/stack/home --ios */
/* npx uri-scheme open exp://127.0.0.1:19000/--/stack/user/23/24 --ios */

const prefix = Linking.makeUrl('/');
const linking = {
    prefixes: [prefix],
    config: {
        screens: {
            HomeStack: {
                path: 'stack',
                initialRouteName: 'Home',
                screens: {
                    Home: 'home',
                    Profile: {
                        path: 'user/:id/:age',
                        parse: {
                            id: (id) => `there, ${id}`,
                            age: Number,
                        },
                        stringify: {
                            id: (id) => id.replace('there, ', ''),
                        },
                    },
                },
            },
            Settings: 'settings',
        },
    },
};

const HomeStack = () => {
    const MyStack = createStackNavigator();

    return (
        <MyStack.Navigator>
            <MyStack.Screen name='Home' component={Home} />
            <MyStack.Screen name='Profile' component={Profile} />
        </MyStack.Navigator>
    );
};
const MyTabs = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer linking={linking}>
            <MyTabs.Navigator>
                <MyTabs.Screen name='HomeStack' component={HomeStack} />
                <MyTabs.Screen name='Settings' component={Settings} />
            </MyTabs.Navigator>
        </NavigationContainer>
    );
}
