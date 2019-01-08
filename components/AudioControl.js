import {Audio} from 'expo';
import React, { Component } from 'react';
import CallBackend from './CallBackend';
import IP from './IPaddr';
import { Text,
    View, 
    StyleSheet,
    Button,
    TextInput,
    ScrollView,
    ListView,
    Dimensions,
    Image,
TouchableOpacity} from 'react-native';
var inAudioPage = false;
export default class AudioContorler extends Component {
    constructor(props){
        super(props);
        this.state = {
            soundFile : null,
            isPlaying : false,
            isLoaded:false,
        }
    }
     


    componentDidMount () {
        console.log('Ready to play a sound......');
        inAudioPage = true;
        
        //this function should be called when user appraches to a point, and the parameter should be info from the point
        this.loadsound("parameter");
    }

    componentWillUnmount(){
        console.log('Stop playing a sound......'); 
        this._onStopPressed();
        inAudioPage=false;
    }



    async loadsound(filename){
        // var all_audio = {
        //     hi:require('../audio/hi.m4a'),
        //     hello:require('../audio/hello.mp3')

        // }
        console.log("loading sound...");
        audio_path = '/api/getaudio/'+filename;

        // the online_song if for easy testing
        online_song = 'https://d1qg6pckcqcdk0.cloudfront.net/country/parmalee_hc201403_05_closeyoureyes.m4a' ;
        
        try{
            
            this.state.soundFile = new Audio.Sound();
            
            // load the online_song for testing
            await this.state.soundFile.loadAsync({ uri:  online_song});
            
            // load sound from CallBackend
            // await this.state.soundFile.loadAsync({ uri:  IP+audio_path});
            
            this.state.isLoaded = true;
            this.state.soundFile.playAsync();
            this.state.isPlaying = true;
            

        }catch(err){
            console.log(err);

        }
    }

    _onPlayPausePressed = () => {
        if(inAudioPage && this.state.isLoaded){
            if (this.state.soundFile != null) {
                if (this.state.isPlaying) {
                  this.state.soundFile.pauseAsync();
                  this.state.isPlaying = false;
                } else {
                  this.state.soundFile.playAsync();
                  this.state.isPlaying = true;
                }
            }
        }        
    };

    _onStopPressed = () => {
        if(inAudioPage){
            if (this.state.isPlaying) {
                this.state.soundFile.stopAsync();
                this.state.isPlaying = false;
            }   
        }   
    };

    _onPlayPressed = () => {
        if(inAudioPage){
            if (! this.state.isPlaying && this.state.isLoaded) {
                this.state.soundFile.playAsync();
                this.state.isPlaying = true;
              }
        }  
    };


    render() {
		return (
			<View style={styles.musicbox}>
            <TouchableOpacity style={styles.stop} onPress={this._onStopPressed}>
            <Image style={{
                // height:Dimensions.get('window').width/12,
                // width:Dimensions.get('window').width/10,
                height:35,
                width:35,
            }} source={require('../pictures/musicbox/stop.png')}>
            </Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pause} onPress={this._onPlayPausePressed}>
            <Image style={{
                // height:Dimensions.get('window').width/12,
                // width:Dimensions.get('window').width/10,
                height:35,
                width:35,
            }} source={require('../pictures/musicbox/pause.png')}>
            </Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.play} onPress={this._onPlayPressed}>
            <Image style={{
                // height:Dimensions.get('window').width/12,
                // width:Dimensions.get('window').width/10,
                height:35,
                width:35,
            }} source={require('../pictures/musicbox/play.png')}>
            </Image>
            </TouchableOpacity>  
			</View>
		)
	}
}
const styles = StyleSheet.create({
    musicbox:{
        padding:10,
        flex: 1,
        position: "absolute",
        top:20,
        left: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(153,204,204,0.6)',
        flexDirection: 'row',
    },
  
    play:{
        marginTop: 0,
        alignSelf: 'flex-end'
    },
  
    stop:{
        marginRight:20,
        alignSelf: 'flex-end',
        marginTop: 0,
    },
    pause: {
        marginRight:20,
        marginTop: 0,
        alignSelf: 'flex-end'
    },
  });