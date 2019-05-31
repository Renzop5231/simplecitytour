import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import MainScreenComponent from './components/MainScreenComponent';
import SignupComponent from './components/SignupComponent';

// import LoginComponent from './LoginComponent';
import LoginComponent from "./components/LoginComponent";

import Locations from "./components/Locations";
import OwnedLocations from "./components/ownedLocations";
import PreviewCity from "./components/PreviewCity";
import CityMap from "./components/CityMap";
import Points from "./components/PointsComponent";
import PreDownload from "./components/PreDownload";
import Storage  from "./components/StorageControl";
import PreCkeck from './components/PreCheck';
import AudioControl from './components/AudioControl';
import PointTypes from './components/PointTypes'


// const SimpleCityTours = createBottomTabNavigator({
//     Home: {screen: MainScreenComponent},
//     Login: {screen: LoginComponent},
//     Signup: {screen: SignupComponent},
//     Locations:{ screen: Locations},
//     // PreviewCity:{screen: PreviewCity},
//     // CityMap:{screen: CityMap} ,
//     // Points:{screen:Points},
//     // PointTypes:{screen:PointTypes}
// });

const navigatorStack = createStackNavigator({
    Locations:{ screen: Locations},
    CityMap:{screen: CityMap},
    Points:{screen:Points},
    PointTypes:{screen:PointTypes}
})

export default createAppContainer(createBottomTabNavigator({
    Home: {screen: MainScreenComponent},
    Login: {screen: LoginComponent},
    Signup: {screen: SignupComponent},
    Cities: navigatorStack,
    Owned: {screen: OwnedLocations},
})) ;

class App extends Component {
    // constructor(props){
    //     super(props);
    //     Text.defaultProps.allowFontScaling=false;
    // }
    componentDidMount(){
        //download serverSequence
        console.disableYellowBox = true;
        PreCkeck.checkUpdate();

        Storage.getallkey();

        //compare client side sequence and server side sequence
        this.updatecheck();
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

        // await Storage.compare('typeSequene', 'serverTypeSequene').then((result) =>{
        //     if(result){
        //         console.log("Types Already the latest version.")
        //     }else{
        //         console.log('Update types info, downloading from remote server....');
        //         PreDownload.getTypes();
        //     }

        // },(err) =>{
        //     console.log('Comparing imageSequence.....Error!')
        // });






    }


    render() {
        return (
            <SimpleCityTours/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
