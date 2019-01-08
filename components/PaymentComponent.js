import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, ListView, Picker } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';


export default class LoginComponent extends Component {

    static navigationOptions = {
        title: 'Unlock Tour',
    };
    render() {
        return (
            <View>

    <View style={styles.rowContainer}>
        <View>
            <Text style={styles.titleText}>Tour Price</Text>
          <Text style={{
                marginLeft: 15
            }}>Location Descriptions</Text>
        </View>
        <View style={styles.price}>
            <Icon name="unlock" size={30} color="white" />
            <Text>$9.99</Text>
        </View>
    </View>

<View style={styles.line}/>


    <Text style={styles.titleText}>Payment Info</Text>
    
    <Picker>

        <Picker.Item label="                                  Visa" Value='1'/>
        <Picker.Item label="                            Master Card" Value='2'/>
        <Picker.Item label="                                  Debit" Value='3'/>

    </Picker>

<TextInput  style = {styles.input}
            returnKeyType="go"
            placeholder='Card Number'
            placeholderTextColor='grey'
            />


<View style={styles.rowContainer}>
<TextInput  style = {styles.expInput}
            returnKeyType="go"
            placeholder='Expire Month'
            placeholderTextColor='grey'
            />

<TextInput  style = {styles.expInput}
            returnKeyType="go"
            placeholder='Expire Year'
            placeholderTextColor='grey'
            />

<TextInput  style = {styles.expInput}
            returnKeyType="go"
            placeholder='CSV'
            placeholderTextColor='grey'
            />
</View>

<View style={styles.line}/>

<TextInput  style = {styles.input}
            returnKeyType="go"
            placeholder='Pay by PayPal'
            placeholderTextColor='grey'
            />


<TouchableOpacity style={styles.buttonContainer}>
             <Text  style={styles.buttonText}>GO > </Text>
</TouchableOpacity> 

 </View>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",

    },
    input: {
        height: 40,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft: 20,
        color: 'grey',
        textAlign: 'center',


    },
    expInput: {
        height: 40,
        width: 100,
        backgroundColor: 'white',
        margin: 10,

        textAlign: 'center',
        color: 'grey',


    },
    buttonContainer: {
        backgroundColor: 'grey',
        paddingVertical: 15,
        marginTop: 20,
        padding: 15,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        margin: 20,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 25,
    },
    price: {

        alignItems: 'flex-end',
        marginLeft: 120,
        flexDirection: "row",

    },
    picker: {
        height: 40,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft: 20,
        padding: 10,
        color: 'grey',
    },

})