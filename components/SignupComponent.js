import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Button, TextInput, Image, Dimensions, ListView, Keyboard } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import IP from './IPaddr';
import CallBackend from './CallBackend';

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
            path = '/api/signup/';
            url = IP + path;
            data = {
                "username": this.state.username,
                "password": this.state.password,
                "email": this.state.email,
            };
            CallBackend.post(path, data).then((fetch_resp) => {
                if (fetch_resp[0]) {
    
    
                    response = fetch_resp[1];
    
                    if (typeof JSON.parse(response._bodyText)['failed'] != "undefined") {
                        if (JSON.parse(response._bodyText)["failed"] === "username existed") {
                            alert("This username alread exists.");
                            return
                        }
                        if (JSON.parse(response._bodyText)["failed"] === "invaild_username_or_password") {
                            alert("Invaild Username Or Password.");
                            return
                        }
    
                        alert('Signup failed.');
                        return
    
                    }
    
                    if (JSON.parse(response._bodyText)["succeed"] === "created") {
                        alert("Successfully Signup.");
                        console.log("User Successfully Signup: " +this.state.username);
                    }
    
                } else {
    
                    err = fetch_resp[1];
    
                    if (err.message = 'Network request failed') {
                        alert('Network failed.');
    
                    } else {
                        alert("Signup failed.");
                    }
    
    
                }
    
            }, (err) => {
    
                console.log("Error: CallBackend.post")
    
            });

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
                <Icon.Button name="user-plus" backgroundColor="blue" onPress={() => {this.sign_up()}}>Create An Account</Icon.Button>
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
})