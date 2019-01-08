import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class CityMap extends Component {

    static navigationOptions = {
        title: 'New York',
    };

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                latitude: 40.730610,
                latitudeDelta: 0.2729186541296684,
                longitude:  -73.935242  ,
                longitudeDelta: 0.26148553937673924,
                    }}>
                      <MapView.Marker 
                        coordinate={{
                latitude: 40.730610,
                latitudeDelta: 0.2729186541296684,
                longitude:  -73.935242  ,
                longitudeDelta: 0.26148553937673924,
                        }}>

                    </MapView.Marker>
                </MapView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
    },

    map:{
        width: 500, 
        height: 300, 
        bottom: 100,
    }
});

