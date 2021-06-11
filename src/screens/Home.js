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
    const [text, onChangeText] = useState(null);
    const API_KEY = 'AIzaSyCosYXoVE-1LflzJyPbZD_fX6xF_ZTwObQ';

    const countryList = ['Argentina', 'España'];
    const countryCodesList = ['AR', 'ES'];

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const textChangeHandler = (e) => {
        const capitalizedWord = capitalizeFirstLetter(e);
        onChangeText(capitalizedWord);
    };

    const submitCountry = (e) => {
        if (countryList.includes(text) && !countries.includes(text)) {
            setCountries([...countries, text]);
        } else if (countries.includes(text)) {
            console.log('El país ya está ingresado');
        } else {
            console.log('No hay país');
        }
        onChangeText(null);
    };

    const removeCountry = (value) => {
        const newArray = countries.filter((country) => country !== value);
        setCountries(newArray);
    };

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
                ).short_name;
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

    const renderedAreas = countries.map((country, i) => (
        <Geojson
            key={i}
            geojson={CountryAreas[country]}
            strokeColor='#0568AE'
            fillColor='#009FDB'
            strokeWidth={1}
        />
    ));

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
            <View style={styles.row}>
                <TextInput
                    placeholder='País'
                    style={styles.input}
                    value={text}
                    onChangeText={textChangeHandler}
                />
                <Button
                    style={styles.button}
                    onPress={submitCountry}
                    title='Insertar'
                />
            </View>
            <MapView
                onPress={getCountry}
                provider='google'
                style={styles.mapStyle}
                zoomEnabled={false}
                maxZoomLevel={0}
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
