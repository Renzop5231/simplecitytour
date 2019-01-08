// when no point info in alllocation--JSON.parse(locations)[name][2] = "undefined"->this.state.points will be undefined
// when 0 point in backend

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ScrollView,Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Dimensions, ListView, TouchableHighlight,ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CallBackend from './CallBackend';

var inPointTypePage= false;
export default class PointTypes extends Component {
    constructor(props) {
		super(props);
    	this.state = { 
            types:null,
            isTypesReady:false
        };
        this.navigate = this.props.navigation.navigate;
        this.getTypes = this.getTypes.bind(this);
        this.goBack  = this.props.navigation.goBack;

    };

    static navigationOptions = {
        title: 'Point Types',
    };

    componentDidMount () {
        console.log('Opening types page......');
        inPointTypePage = true;
        this.getTypes();
    }

    componentWillUnmount(){
        console.log('Leaving types page......');
        inPointTypePage = false;
    }






    async getTypes() {
        path = '/api/types/';
        url = IP +path;
        data = {"purpose":'types'};
        console.log('Getting types from server');
        await CallBackend.post_auth(path, data).then((fetch_resp) =>{
            console.log('Retrieved types info backend respong');
            if (fetch_resp[0]){
                response = fetch_resp[1];
                if(response === 'No Stored Token'){
                    alert('You need to login to view this page.');
                    this.goBack(null);
                
                }else{
                    console.log(response);                    
                    if (false && typeof JSON.parse(response._bodyText)['detail'] != "undefined") {
                        if(JSON.parse(response._bodyText)['detail'] == 'Signature has expired.'){
                            alert('User already logout.');
                            this.goBack(null);
                        }   
                    }else{ 
                        if(typeof JSON.parse(response._bodyText) != "undefined") {
                            allTypes      =    JSON.parse(response._bodyText);
                            console.log(allTypes);
                        

                            if(inPointTypePage){
                                this.setState({
                                    types:allTypes,
                                    isTypesReady: true,
                                })
                            }

                        }
                    }
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
                console.log(err.message);
                alert("Internal error.");		
        });

        return 'none'
    }


    renderPoints(){
        let {types} = this.state;
        items = types.map((item) =>{
            return (
              <TouchableHighlight underlayColor="gray" key={item} onPress={() =>  navigate('Points', {cityName: this.props.navigation.state.params.cityName, 
                                                                                                                cityDesc:this.props.navigation.state.params.cityDesc,
                                                                                                                cityLat:this.props.navigation.state.params.cityLat,
                                                                                                                cityLng:this.props.navigation.state.params.cityLng,
                                                                                                                })}>
                  <View style={{flex:1,flexDirection: "row", borderColor:'black',borderWidth: 1, height:50,justifyContent:'center'}}>
                      <Text adjustsFontSizeToFit={false} style ={{fontSize:30, color:'green'}}>{item}</Text>
                  </View>
              </TouchableHighlight>
            )
        });

        if(types.length != 0){
            return (
                <View style={styles.container}>
                    {items}
                </View>
            );

        }else{
            return(
            <View style={{flex:1, width:Dimensions.get('window').width, height:Dimensions.get('window').width, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:40}}>Sorry!!</Text>
                <Text style={{fontSize:25}}>No point for this city!</Text>
            </View>
            );

        }
    }

    render() {
		return (
			<ScrollView style={styles.scrollContainer}>
          { this.state.isTypesReady &&this.renderPoints()}
          {!this.state.isTypesReady && <View style={{alignItems:'center', top:Dimensions.get('window').height/2 - 100}}>                    
                                    <ActivityIndicator size="large"/>
                                </View>}  
			</ScrollView>
		)
	}

}

const styles = StyleSheet.create({
    scrollContainer:{
        flex: 1,
        backgroundColor:'#E3E3E3',
      },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    pointName: {
        width:Dimensions.get('window').width/4 * 3,
        marginLeft:10,
        justifyContent: 'center',
    },
})