import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = ({ route }) => {
    return (
        <View style={styles.container}>
            <Text>Hola {route.params?.id || 'Unknown'}!</Text>
            <Text>
                Type of age parameter is{' '}
                {route.params?.age ? typeof route.params.age : 'undefined'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Profile;
