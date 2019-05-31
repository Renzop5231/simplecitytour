import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import CallBackend from './CallBackend';
import Storage from './StorageControl';
import axios from 'axios';
import AudioControler from './AudioControl';
import { Text,
		 View,
		 StyleSheet,
		 Button,
		 TextInput,
		 ScrollView,
		 ListView,
		 Dimensions,
		 Image,
     TouchableHighlight,
     TouchableOpacity,
    Platform} from 'react-native';




var inLocationPage= false;
export default class OwnedLocations extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imgURL: {},
      // cityName: "none",
      // numPoints: "none",
      allLocations:[],
      ready: false,
      auth_token: null,
      audioFile: "",
      ownedLocations: [],
      points: [],
      userID: 0,
      email: ''
    };
    navigate = this.props.navigation.navigate;
  }

  componentDidMount () {
    console.log('Opening ownedlocation page......');
    inLocationPage = true;
    this.get_imgs();
    this.getToken();
    this.start();
  }

  componentWillUnmount(){
    console.log('Leaving ownedlocation page......');
    inLocationPage = false;

}

	static navigationOptions = {
		title: 'OwnedLocations',
		headerStyle: {
			backgroundColor: '#7FFF00',
		},
  };
  
  async getToken(){
    console.log("thisis ahpp");
    await Storage.getItem('email').then((resp) =>{
        console.log(resp);
        if(resp){
            this.setState({email: resp});
        }
    }, (err) =>{
        console.log('Geting token from database...Error!');
        console.log(err.message);
    });
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
  start() {
    fetch('https://simplecitytours.com/api/users/', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
        console.log('Success:', JSON.parse(response._bodyText))// parses JSON response into native Javascript objects 
        userlist = JSON.parse(response._bodyText);
        for(i=0;i<userlist.length;i++){
          if(userlist[i].email == this.state.email){
            this.setState({userID: userlist[i].id});
            console.log(userlist[i].id);
          }
        }
    });

    fetch('https://simplecitytours.com/api/location/', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
        console.log('Success:', JSON.parse(response._bodyText))// parses JSON response into native Javascript objects 
        locations = JSON.parse(response._bodyText);
        owned = []
        for(i=0;i<locations.length;i++){
            if(locations[i].users.includes(14)){
            console.log("this location: " + JSON.stringify(locations[i]));
            owned.push(locations[i]);
            }
        }
        this.setState({ownedLocations:owned});
        console.log(this.state.ownedLocations);
    });

    fetch('https://simplecitytours.com/api/point/', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
        console.log('Success:', JSON.parse(response._bodyText))// parses JSON response into native Javascript objects 
        points = JSON.parse(response._bodyText);
        this.setState({points: points});
    });
    }

  async get_imgs(){
    await Storage.getItem('allLocations').then((locations) =>{
      if(locations){
        if(inLocationPage){
          this.setState({
            allLocations:JSON.parse(locations)
          })
        }
      }
      // this.state.allLocations =JSON.parse(locations);

    },(err) =>{
      console.log("Get locations error.")
    })
    var allCities = this.state.allLocations;

    allUri = {};
    for (var key in allCities) {
      // this.state.cityName = key;

      await Storage.getItem(key).then((value) => {
        allUri[key] = value;
      },(err) =>{alert('err')})

    }

    if(inLocationPage){
      this.setState({
        imgURL:allUri,
        ready: true
      })
    }
  }

  format_name(name){
    if (name.includes(',')){
      index = name.indexOf(',');
      return name.substring(0,index)
    }
    return name
  }


  renderCities() {
    // var allCities = this.state.ownedLocations;
    // for(i=0;i<allCities.length;i++){
    //     console.log(allCities[i].name);
    //   }
    var allCities = this.state.ownedLocations;
    all_name_point= [];
    name_point_dict = {};

    for (i=0;i<allCities.length;i++) {
        pointlist = [];
      name_point_dict = {};
    //   for(j=0;j<this.state.points.length;j++){
    //     if(this.state.points[j].location == allCities[i].id){
    //         pointlist.push(this.state.points[j]);
    //     }
    //}
      name_point_dict["id"] = i;
      name_point_dict["name"] = allCities[i].name;
      name_point_dict["point"] = '0';
      name_point_dict["lat"] = allCities[i].lat;
      name_point_dict["lng"] = allCities[i].lng;
      name_point_dict["description"] = allCities[i].description;
      all_name_point.push(name_point_dict);
    }

    items = all_name_point.sort(function(a,b){
      // sort cities by name
      var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
      if (nameA < nameB) //sort string decending
          return 1
      if (nameA > nameB)
          return -1
      return 0 //default return value (no sorting)

    }).map((item) =>{
      console.warn(item);
      return (
        <TouchableHighlight underlayColor="gray" key={item.id} onPress={() =>  navigate('CityMap', {cityName: item.name,
          cityDesc: item.description,
          cityLat: item.lat,
          cityLng: item.lng,
					cityPoints: item.point
          })}>
            <View style={styles.box}>
                <Image style={{
                    height:Dimensions.get('window').width/3,
                    width:Dimensions.get('window').width/2-6,
                  }} source={{uri:"data:image/jpg;base64,"+this.state.imgURL[item.name]}}>
                </Image>
              <View style={styles.container2}>
                <Text style={{color: "black", fontSize: 20, alignSelf:'center'}}>{this.format_name(item.name)}</Text>
                <Text><Text style={{color: 'red'}}>{item.point}</Text> POI</Text>
              </View>
            </View>
        </TouchableHighlight>
      )
    });


    if (this.state.ready == true){

      return (
        <View style={styles.container}>

          {items}
        </View>
      );
  }
}


	render() {
		return (
			<ScrollView style={styles.scrollContainer}>
          { this.renderCities()}
          <TouchableOpacity style={styles.button} onPress={() => this.start()}>
                        <Text style={styles.buttonText}> test </Text>
                    </TouchableOpacity>
          {/* <AudioControler audioFile={this.state.audioFile}/> */}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	scrollContainer:{
	    flex: 1,
	    backgroundColor:'#333333',
	  },

	  container:{
	      flex:1,
	      flexDirection: "row",
	      flexWrap: "wrap",
	      padding: 2,
	  },

	  box:{
	    margin: 2,
	    borderColor:'black',
	    borderWidth: 1,
	      width:Dimensions.get('window').width/2-6,
	      height: Dimensions.get('window').width/2-6,
	      alignItems: "center",
	    overflow: "hidden"
	  },
	  container2: {
	    backgroundColor:'#FFE303',
	    width: Dimensions.get('window').width/2-6,
	    height:Dimensions.get('window').width/2-6 - Dimensions.get('window').width/3,
	    justifyContent: 'center',
	    alignItems: 'center',
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
