// when no point info in alllocation--JSON.parse(locations)[name][2] = "undefined"->this.state.points will be undefined
// when 0 point in backend

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ScrollView,Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Dimensions, ListView, TouchableHighlight,ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import CallBackend from './CallBackend';
import Storage from './StorageControl';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

var inPointPage= false;
export default class Points extends Component {
    constructor(props) {
		super(props);
    	this.state = { 
            cityDesc:'',
            cityimg:'',
            isLogin:false,
            hasnetwork:true,
            isReady:false,
            points:null,
            isReady:false,

        };
        this.navigate = this.props.navigation.navigate;
        this.get_points = this.get_points.bind(this);
        this.renderPoints = this.renderPoints.bind(this);
        this.format_name = this.format_name.bind(this);

    };

    static navigationOptions = {
        title: 'Points',
    };

    componentDidMount () {
        console.log('Opening point page......');
        inPointPage = true;
        this.get_points();
    }

    componentWillUnmount(){
        console.log('Leaving point page......');
        inPointPage = false;
    }

    format_name(name){
        if (name.includes(',')){
          index = name.indexOf(',');
          return name.substring(0,index)
        }
        return name
    }

    async get_points(){
        var cityName = this.props.navigation.state.params.cityName;
        var pointsInCity = null;
        await Storage.getItem('allPoints').then((allpoints) =>{
            if(allpoints){
                pointsInCity = JSON.parse(allpoints)[cityName];

            }

        },(err) =>{
          console.log("Get description error.")
        });

        if (pointsInCity != null){
            if(pointsInCity.length > 0){
                for(var point in pointsInCity){
                    await Storage.getItem('pImage' + '_'+ this.format_name(cityName) + '_' + pointsInCity[point].name).then((URI) =>{
                        if(URI){
                            var imageURI = URI; //the base64 encoded image
                            pointsInCity[point]['img'] = imageURI;
                            if(inPointPage){
                                this.setState({
                                    points:pointsInCity,
                                    isReady: true,
                                })
                            }
                        }
                    },(err) =>{
                        console.log('Error in reading image of point');
                        console.log(err);
                    });
                }
            }else{
                this.setState({
                    points:pointsInCity,
                    isReady: true,
                })
            }
        }    
    }

    renderPoints(){
        let {points} = this.state;
        items = points.map((item) =>{
            return (
              <TouchableHighlight underlayColor="gray" key={item.name} onPress={() =>  navigate('CityMap', {cityName: this.props.navigation.state.params.cityName, 
                                                                                                                cityDesc:this.props.navigation.state.params.cityDesc,
                                                                                                                cityLat:this.props.navigation.state.params.cityLat,
                                                                                                                cityLng:this.props.navigation.state.params.cityLng,
                                                                                                                })}>
                  <View style={{flex:1,flexDirection: "row", borderColor:'black',borderWidth: 1,}}>
                      <Image style={{
                          // flex: 1,
                          height:Dimensions.get('window').width/4,
                          width:Dimensions.get('window').width/4,
                          // justifyContent: "flex-start",
                          // position: "absolute"
                        }} source={{uri:"data:image/jpg;base64,"+item.img}}>
                      </Image>
                    <View style={styles.pointName}>
                      <Text adjustsFontSizeToFit={false} style ={{fontSize:20}}>{item.name}</Text>
                    </View>
                  </View>
              </TouchableHighlight>
            )
        });

        if(points.length != 0){
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
          { this.state.isReady &&this.renderPoints()}
          {!this.state.isReady && <View style={{alignItems:'center', top:Dimensions.get('window').height/2 - 100}}>                    
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