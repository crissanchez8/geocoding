import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import MapView, { Geojson, Polygon } from 'react-native-maps';
import * as CountryAreas from '../assets/index';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const Home = ({ navigation }) => {
    const [countries, setCountries] = useState([]);
    const API_KEY = 'AIzaSyCosYXoVE-1LflzJyPbZD_fX6xF_ZTwObQ';
    const countryCodesList = ['Argentina', 'Spain'];

    const getCountry = async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
            ).then((res) => res.json());
            const { address_components } = res.results[0];
            if (address_components) {
                const countryCode = address_components.find(
                    (el) => el.types[0] === 'country'
                ).long_name;
                if (
                    countryCodesList.includes(countryCode) &&
                    !countries.includes(countryCode)
                ) {
                    setCountries([...countries, countryCode]);
                } else if (countries.includes(countryCode)) {
                    console.log('El país ya está ingresado');
                } else {
                    console.log('No hay país');
                }
            }
        } catch (err) {
            throw err;
        }
    };

    const renderedAreas = countries.map((country, i) => {
        return (
            <Geojson
                key={i}
                geojson={CountryAreas[country]}
                strokeColor='#0568AE'
                fillColor='#009FDB'
                strokeWidth={1}
            />
        );
    });

    const renderedCountries = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.text}>{item}</Text>
            <TouchableOpacity onPress={() => removeCountry(item)}>
                <Text style={styles.dltButton}>X</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <MapView
                onPress={getCountry}
                provider='google'
                style={styles.mapStyle}
                maxZoomLevel={12}
                minZoomLevel={0}
            >
                {renderedAreas}
            </MapView>
            <FlatList
                style={styles.list}
                data={countries}
                renderItem={renderedCountries}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 20,
        borderWidth: 1,
        width: 200,
        padding: 5,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'blue',
    },
    text: {
        color: 'black',
        fontSize: 18,
        marginBottom: 10,
        marginRight: 10,
    },
    list: {
        marginTop: 20,
    },
    dltButton: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mapStyle: {
        width: 380,
        height: 480,
        /* width: Dimensions.get('window').width,
        height: Dimensions.get('window').height, */
    },
});

export default Home;
