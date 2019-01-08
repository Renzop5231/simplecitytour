import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Keyboard, TouchableOpacity, TextInput, Image, Dimensions, ListView, TouchableHighlight,ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import CallBackend from './CallBackend';
import Storage from './StorageControl';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

var inLoginPage= false;
var rmNetworkstatus = null;
export default class LoginComponent extends Component {
    constructor(props) {
		super(props);
    	this.state = { 
			username: "username",
            password: "password",
            lastuser:null,
            isLogout:true,
            hasnetwork:true,
            shownetwork:true,
            pressed:false,
            isReady:false,
            test: ''

        };
        this.goBack  = this.props.navigation.goBack;
        this.navigate = this.props.navigation.navigate;
        this.login = this.login.bind(this);
        this.removeNetworkstatus = this.removeNetworkstatus.bind(this);
        changeShownNetworkState = this.changeShownNetworkState.bind(this);
    };

    static navigationOptions = {
        title: 'LOGIN',
    };

    componentDidMount () {
        console.log('Opening login page......');
        inLoginPage = true;
        this.get_user();
    }
    componentWillUnmount(){
        console.log('Leaving login page......');
        inLoginPage = false;
        
    }

    async get_user(){
        verify_token = null;
        lastuser=null;
        await Storage.getItem('username').then((name) =>{
            console.log("Get user from database......");
            if(name){
                if(inLoginPage){
                    console.log("User: " + name + " login previously.");
                    lastuser=name;
                    this.setState({
                        lastuser: name,
                        username:name,
                    })

                }
                 
            }else{
                console.log('No user data.')
                if(inLoginPage){
                    this.setState({
                        isLogin  : false,
                        isReady : true,
                    })
                    this.removeNetworkstatus();


                }
            }
    
        },(err) =>{
          console.log("Get username error.")
        });

        if(lastuser != null){
            await Storage.getItem('token').then((resp) =>{
                console.log("Get user token from database......");
                if(resp){
                    verify_token = resp;
                }else{
                    console.log('No user token info.')
                    if(inLoginPage){
                        this.setState({
                            isLogin  : false,
                            isReady : true,
                        })
                        this.removeNetworkstatus();
                    }
                }
            },(err) =>{
              console.log("Get username error.")
            });
        }

        if(verify_token != null){
            path ='/api/verify_token/';
            data = {'token' : verify_token}
            console.log('Verifying token......');
            await CallBackend.post(path, data).then((fetch_resp) =>{
                if (fetch_resp[0]){
                    response = fetch_resp[1];
                    if(typeof JSON.parse(response._bodyText)['non_field_errors'] != "undefined" && JSON.parse(response._bodyText)['non_field_errors'][0] == 'Signature has expired.'){
                        console.log('User token expired.')
                        if(inLoginPage){
                            this.setState({
                                isLogin: false,
                                isReady:true,
                            })

                            this.removeNetworkstatus();
                        }
    
                    };

                    if(typeof JSON.parse(response._bodyText)['token'] != "undefined"){
                        if(inLoginPage){
                            console.log('Trying to login as: ' +this.state.username);
                            this.setState({
                                isLogin:true,
                                // isLogout: false,
                                isReady:true,
                            });

                            this.removeNetworkstatus();
                        }

                    }

                }else{
                    err = fetch_resp[1];



                    if (err.message = 'Network request failed'){
                        if(inLoginPage){
                            this.setState({
                                hasnetwork:false,
                                // isLogin:false,
                            }) 
                        }  
                        
                    }
                    if(inLoginPage){
                        this.setState({
                            isReady:true,
                            isLogin:false,
                        }) 
                        this.removeNetworkstatus();
                    }

                    console.log('Error in verifying get user : '+err.message);       
                }            
            },(err) =>{
                alert('Internal error.')          
            });

        }
       


      }

    logout(){
        console.log('User is trying to logout: ' +this.state.username);
        Storage.removeItem("token");
        Storage.getItem('token').then((token) =>{
            // console.log(token);
        },(err) =>{
            console.log(err)
        }); 
        this.setState({
            isLogout :  true,
            isLogin  :  false,
        })
        this.goBack(null);

    }

    login() {
        console.log('User is trying to log in: ' +this.state.username);
        if(inLoginPage){
            this.setState({
                pressed:true,
            }) 
        };
        user_login = this.state.username;
		path ='/app/login/';
		url = IP +path;
		data = {"username":this.state.username,"password":this.state.password};
		CallBackend.post(path, data).then((fetch_resp) =>{
            if(inLoginPage){
                this.setState({
                    pressed:false,
                }) 
            };
			if (fetch_resp[0]){


			response = fetch_resp[1];


			if (typeof JSON.parse(response._bodyText)["non_field_errors"] != "undefined") {
                if (JSON.parse(response._bodyText)["non_field_errors"][0] === "Unable to log in with provided credentials."){
                    alert("Invaild username or password.")
                }
            }

            if (typeof JSON.parse(response._bodyText)["token"] != "undefined") {
				token = JSON.parse(response._bodyText)["token"];
                Storage.saveItem('token', token);
                Storage.saveItem('username', user_login);
                this.goBack(null);

            	console.log("User Login Successfully : " + this.state.username )
			}
			}else{
				err = fetch_resp[1];
				if (err.message = 'Network request failed'){
					alert('Network failed.')
				} else{
					alert("Login failed.")
				}
			}

		},(err) =>{
            if(inLoginPage){
                this.setState({
                    pressed:false,
                }) 
            }
            console.log(err.message);
			alert("Internal error.");
				
        });
    }

    changeShownNetworkState(){
        if(inLoginPage){
            this.setState({
                shownetwork:false
            })
        }
    }

    removeNetworkstatus(){
        setTimeout(function(){changeShownNetworkState() }, 5000); 
    }


    render() {
            if(! this.state.isLogin){
                return (
                    <View style={styles.container}>
                        {!this.state.isReady && <Text style={{ fontSize:25,width:Dimensions.get('window').width,position:'absolute', top:0, textAlign:'center',backgroundColor:'#f0fff0'}}>Connecting to the server.....</Text>}
                        {this.state.shownetwork && !this.state.hasnetwork && <Text style={{ fontSize:25,width:Dimensions.get('window').width,position:'absolute', top:0, textAlign:'center',backgroundColor:'#f0fff0'}}>Network Disconnect</Text>}

                        <TextInput  style = {styles.input}
                                    onSubmitEditing={() => this.passwordInput.focus()}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='email-address'
                                    returnKeyType="next"
                                    placeholder={'username'}
                                    placeholderTextColor='black'
                                    ref={(el) =>{this.usernameInput = el} }
                                    onChangeText = {(username) => this.setState({username})}
                                    />

                        <TextInput  style = {styles.input}
                                    onSubmitEditing={() => this.login()}
                                    returnKeyType="go"
                                    placeholder={'password'}
                                    placeholderTextColor='black'
                                    secureTextEntry
                                    ref={(pw) =>{this.passwordInput  = pw} }
                                    onChangeText = {(password) => this.setState({password})}/>
        
        
                        <Text style= {styles.fgpw}>Forget Password?</Text>
                        {this.state.pressed && <ActivityIndicator size="large"/>}
                        { ! this.state.pressed && <TouchableOpacity style={styles.buttonContainer} onPress= {() =>{Keyboard.dismiss; this.login()}}> 
                                     <Text style={styles.buttonText}>GO > </Text>
                        </TouchableOpacity>} 
        
                    </View>
                )

            }else{
                return(
                    <View style={{flex:1, flexDirection: 'column', backgroundColor:'white'}}>
                        <TouchableHighlight underlayColor="gray" onPress={() =>  this.goBack(null)}>
                            
                            <View style={{flex:1, alignItems:"center",flexDirection: 'column'}}>
                                <Image style={{
                                    height:Dimensions.get('window').width/3-6,
                                    width:Dimensions.get('window').width/3-6,
                                    marginTop:70
                                }} source={require('../pictures/user/user.gif')}/>
                                <View>
                                    <Text style = {{fontSize:60, alignItems:"center"}} >{this.state.lastuser}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => this.logout()}>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}> LOG OUT </Text>
                        </TouchableOpacity>
                    </View>  
                  )

            }

      
        //   }else{
        //       return(
        //         <View style={{alignItems:'center', top:Dimensions.get('window').height/2 - 100}}>
        //             <Text style = {{fontSize:50}}>LOADING....</Text>                      
        //             <ActivityIndicator size="large"/>
        //         </View>
        //       )


        //   }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        // position:"relative",
        // left:50,
        height: 40,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft: 20,
        padding: 10,
        color: 'grey'

    },
    fgpw: {
        padding: 10,
        textAlign: 'right',

    },
    buttonContainer: {
        backgroundColor: 'grey',
        paddingVertical: 15
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    button: {
        top:Dimensions.get('window').width/3 + 160,
        backgroundColor: 'yellow',
        padding: 25,
        marginBottom: 15,
        marginHorizontal: 10,
        borderRadius:20,
        alignItems:'center',
  },
})