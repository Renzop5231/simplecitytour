import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text,
		 View, 
		 StyleSheet,
		 Button,
		 TextInput,
		 ScrollView,
		 ListView,
		 Dimensions,
		 Image,
     ActivityIndicator,
     TouchableOpacity,
     Platform} from 'react-native';

import Storage from './StorageControl';

var inPreviewCityPage= false;
export default class PreviewCity extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      imgURL: null,
      imgDescription: null,
      cityName: "none",
      numPoints: "none",
      imgReady:false,
  };
  navigate = this.props.navigation.navigate;
}

  componentDidMount(){
    console.log('Opening previewCity page......');
    inPreviewCityPage = true;
    this.get_img_desc();    
  }

  componentWillUnmount(){
    console.log('Leaving previewCity page......');
    inPreviewCityPage = false;
    
}



  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: `${state.params.cityName}`,
    };
  };

  async get_img_desc(){
    name = this.props.navigation.state.params.cityName;
    await Storage.getItem(name).then((value) => {
      if(inPreviewCityPage){
        this.setState({
          imgURL:value,
          imgReady:true,
        })
      }

    },(err) =>{
      console.log(err);
      alert('Error!');
    })
  }


	render() {
    const {navigate} = this.props.navigation;
    if (this.state.imgReady){
      return (
        <View style={{flex:1,flexDirection: 'column',backgroundColor: '#E8FFFF',}}>
          <View style={styles.imageview}>
            <Image style={{
                        // flex: 1,
                        // position: "absolute",
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height/3
                      }} source={{uri:"data:image/jpg;base64,"+this.state.imgURL}} />
          </View>

          <View style = {styles.textview}>
            <Text style = {styles.text}>{this.props.navigation.state.params.cityDesc}</Text>
          </View>
  
          <View style={styles.buttonview}>
            {/* <TouchableOpacity style={styles.button} 
                              onPress={() => navigate('CityMap',{ cityName:this.props.navigation.state.params.cityName,
                                                                  cityLat:this.props.navigation.state.params.cityLat,
                                                                  cityLng:this.props.navigation.state.params.cityLng,})}> */}
            <TouchableOpacity style = {styles.button} 
                         onPress = {() => navigate('PointTypes',{ cityName:this.props.navigation.state.params.cityName,
                                                                  cityLat:this.props.navigation.state.params.cityLat,
                                                                  cityLng:this.props.navigation.state.params.cityLng,})}>
              <Text style={styles.buttontext}> START TOUR </Text>
            </TouchableOpacity>  
          </View>
        </View>
      )

    }else{
      return (
        <View style={{flex:1}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }

	}
}

const styles = StyleSheet.create({
  imageview:{

  },

  textview:{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/3,
    justifyContent:'center',
    padding:10,
    backgroundColor: '#E8FFFF',
  },

  text:{
    fontSize:20,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        fontFamily: 'Cochin',
      },
      android: {
        
      },
    }),
  },

  buttonview:{
    // flex:1,
    position: "absolute",
    top: Dimensions.get('window').height/3*2,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height/3,
    alignItems: "center",
    backgroundColor: '#E8FFFF',
    ...Platform.select({
      ios: {

      },
      android: {

      },
    }),
  },

  button:{
    backgroundColor: 'yellow',
    marginBottom:35,
    borderRadius:20,
    padding: 25,
    ...Platform.select({
      ios: {

      },
      android: {
        width:200,
      },
    }),
  },

  buttontext:{
    fontWeight: 'bold',
    
    ...Platform.select({
      ios: {
        fontSize: 30

      },
      android: {
        fontSize: 20,
      },
    }),

  }



});
