import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Text, View, StyleSheet, Button, TextInput, Image, Dimensions, ListView, Keyboard, TouchableOpacity, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import IP from './IPaddr';
import CallBackend from './CallBackend';
import axios from 'axios';

export default class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirm: "",
            hidePass: true,
            textColor: "gray",
            screenwidth: Dimensions.get('window').width
        };

        this.sign_up = this.sign_up.bind(this);
        this.saveItem = this.saveItem.bind(this);

    };

    componentDidMount () {
        console.log('Opening signup page......');
    }

    async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch ( error ) {
            console.error('AsyncStorage error: ' + error.message);
        }
    }

    static navigationOptions = {
        title: 'Sign Up',
    };


    sign_up() { 
        if(this.state.password != this.state.confirm){
            alert('Password not match.');
        }else{
            console.log("pressed");
            const {navigate} = this.props.navigation;
            data= {"username": this.state.username,
                "password1": this.state.password,
                "password2": this.state.password,
                "email": this.state.email}
            fetch('https://simplecitytours.com/rest-auth/registration/', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                //credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                //redirect: 'follow', // manual, *follow, error
                //referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
            .then(response => {
                console.log('Success:', JSON.parse(response._bodyText).key);

                Alert.alert(
                    'Login Successful',
                    JSON.parse(response._bodyText).key,
                    [
                      {text: 'Okay', onPress: () => {
                          console.log('Okay pressed');
                          navigate('Login');
                        }}
                    ],
                    { cancelable: false }
                  )

            })
            // .catch((error) => {
            //     console.error(error);
            //   });
            ;
        }
    }


    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>

				
				<Text style={{
                    marginTop:15,
                    marginBottom:10,
                    fontSize:30,
                    alignSelf:'center'
                }}>Simple City Tour</Text>
                <Text style={{
                    marginTop:15,
                    marginBottom:10,
                    fontSize:20,
                    alignSelf:'center'
                }}>Sign Up</Text>
                <TextInput  style = {styles.input}
                                    onSubmitEditing={() => this.emailInput.focus()}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder='Username'
                                    placeholderTextColor='black'
                                    ref={(un) =>{this.usernameInput = un} }
                                    onChangeText = {(username) =>this.setState({username})}/>

                <TextInput  style = {styles.input}
                                    onSubmitEditing={() => this.passwordInput.focus()}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='email-address'
                                    returnKeyType="next"
                                    placeholder='Email Address'
                                    placeholderTextColor='black'
                                    ref={(el) =>{this.emailInput = el} }
                                    onChangeText = {(email) =>this.setState({email})}/>

                <TextInput  style = {styles.input}
                                    onSubmitEditing={() => this.cpasswordInput.focus()}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder='Password'
                                    secureTextEntry = {this.state.hidePass}
                                    placeholderTextColor='black'
                                    ref={(pw) =>{this.passwordInput = pw} }
                                    onChangeText = {(password) =>this.setState({password})}/>

                <TextInput  style = {styles.input}
                                    onSubmitEditing={Keyboard.dismiss}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="done"
                                    placeholder='Confirm Password'
                                    secureTextEntry = {this.state.hidePass}
                                    placeholderTextColor='black'
                                    ref={(cpw) =>{this.cpasswordInput = cpw} }
                                    onChangeText = {(confirm) =>this.setState({confirm})}/>
                <View style= {{marginTop:25, width:this.state.screenwidth/2, alignSelf:'center'}}>
                <TouchableOpacity style={styles.Button} name="user-plus" backgroundColor="blue" onPress={() => {this.sign_up()}}>
                <Text>Create An Account</Text>
                </TouchableOpacity>
                </View> 
			

		   

			</View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft: 20,
        padding: 10,
        color: 'grey'

    },
    button: {
        width:Dimensions.get('window').width/2.3,
        backgroundColor: '#FFE303',
        marginHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                alignItems:'center',
                padding: 25,
                marginBottom: 15,
            },
            android: {
                width: Dimensions.get('window').width/3,
                padding: 10,
                marginBottom: 10,
  
            },
          }),
    },
})