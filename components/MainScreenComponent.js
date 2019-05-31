import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button, StyleSheet, Image, TouchableOpacity,Dimensions,Platform, FlatList } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AsyncStorage} from 'react-native';
import Storage from './StorageControl';
import PreDownload from "./PreDownload";
import PreCkeck from './PreCheck';

export default class HomeScreenComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            auth_token: null,
            show: false,
        }
      }


    static navigationOptions = {
        title: 'Simple City Tours',
        headerStyle: {
          backgroundColor: '#7FFF00',
        },
    };

    componentDidMount () {
        console.log('Opening home page......');
        //download serverSequence
        console.disableYellowBox = true;
        PreCkeck.checkUpdate();

        Storage.getallkey();

        //compare client side sequence and server side sequence
        this.updatecheck();

        this.getToken();
    }

    
    async getToken(){
        console.log("thisis ahpp");
        await Storage.getItem('token').then((resp) =>{
            console.log(resp);
            if(resp){
                this.setState({auth_token: resp});
            }
        }, (err) =>{
            console.log('Geting token from database...Error!');
            console.log(err.message);
        });
    }

    async updatecheck(){
        await Storage.getItem('citySequence').then((value) => {
            if (value === null){
                console.log('No location info, downloading from remote server....');
                PreDownload.getLocations();
            }
        });

        await Storage.getItem('imageSequence').then((value) => {
            if (value === null){
                console.log('No local image info, downloading from remote server....');
                PreDownload.getCityImgs();
            }
        });

        await Storage.getItem('pointSequence').then((value) => {
            if (value === null){
                console.log('No local points info, downloaing from remote server....');
                PreDownload.getPoints();
            }
        });

        // await Storage.getItem('typeSequene').then((value) => {
        //     if (value === null){
        //         console.log('No local types info, downing from remote server....');
        //         PreDownload.getTypes();
        //     }
        // });

        await Storage.compare('citySequence', 'serverCitySequence').then((result) =>{
            if(result){
                console.log("Locations Already the latest version.");
            }else{
                console.log('Update location info, downloading from remote server....');
                PreDownload.getLocations();
            }

        },(err) =>{
            console.log('Comparing citySequence.....Error!')
        });


        await Storage.compare('imageSequence', 'serverImageSequence').then((result) =>{
            if(result){
                console.log("Images Already the latest version.")
            }else{
                console.log('Update image info, downloading from remote server....');
                PreDownload.getCityImgs();
            }

        },(err) =>{
            console.log('Comparing imageSequence.....Error!')
        });

        await Storage.compare('pointSequence', 'serverPointSequence').then((result) =>{
            if(result){
                console.log("Points Already the latest version.")
            }else{
                console.log('Update point info, downloading from remote server....');
                PreDownload.getPoints();
            }

        },(err) =>{
            console.log('Comparing imageSequence.....Error!')
        });
    }
    
    start() {
        console.log("look for this");

        axios({method: "get", url:'https://simplecitytours.com/app/get_all_locations/'})
            .then(function (response) {
                // handle success
                console.log(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
      }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                {/* <FlatList data={this.state.data.Algeria} renderItem={({item}) => <Text>{item}</Text>}/> */}
                <Image style={styles.image} source={require('./img/tour.jpeg')}/>
                <View style={styles.textView}>
                    <View>
                        <Text style={styles.titleText}> Simple City Tours</Text>
                    </View>

                    <View>
                        <Text style={styles.textContent}>A Few Simple Tours of The City You Are About To Visit.</Text>
                    </View>

                    <View>
                        <Text style={styles.textContent}>- A Short or Long Walk</Text >
                        <Text style={styles.textContent}>- A Coffee Shop Walk</Text>
                        <Text style={styles.textContent}>- A Short or Long Bike Ride</Text>
                        <Text style={styles.textContent}>- Each City Will Vary</Text>
                    </View>
                </View>

                <View>
                    <TouchableOpacity style={styles.buttonl} onPress={() => navigate('Locations')} >
                        <Text style={styles.buttonText}> TOUR LOCATIONS </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.button} onPress={() => navigate('Signup')}>
                        <Text style={styles.buttonText}> SIGN UP </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigate('Login')}>
                        <Text style={styles.buttonText}> LOG IN </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.button} onPress={() => this.start()}>
                        <Text style={styles.buttonText}> test </Text>
                    </TouchableOpacity> */}
                </View>



            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:'#333333',
  },
  image:{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height/2.5-30,
      marginBottom: 15,
  },
  textView:{
      flexDirection: 'column',
      alignItems:'center',
  },
  buttonl:{
      marginHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#7FFF00',
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
          ios: {
              width:Dimensions.get('window').width/1.5,
              alignItems:'center',
              padding: 25,
              marginBottom: 15,
          },
          android: {
              width:Dimensions.get('window').width/1.4,
              height: 50,
              // alignItems:'center',
              padding: 10,
              marginBottom: 10,

          },
        }),

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
  titleText: {
      color: 'white',
        textAlign: 'center',
      ...Platform.select({
          ios: {
              fontWeight: 'bold',
              fontSize: 25,
              marginBottom: 10
          },
          android: {
              fontWeight: 'bold',
              fontSize: 20,
              marginBottom: 5,
          },
        }),

  },
  textContent: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 20,
      ...Platform.select({
          ios: {
              fontSize: 15,
              marginBottom: 5,
          },
          android: {
              fontSize: 15,
              // marginBottom: 5,

          },
        }),

  },
  buttonText: {
      // fontWeight: 'bold',

      ...Platform.select({
          ios: {
              fontWeight: 'bold',
              fontSize: 20,
          },
          android: {
              fontWeight: 'bold',
              fontSize: 15,
          },
        }),

  }
});
