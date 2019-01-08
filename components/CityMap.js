import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import AudioContorler from './AudioControl';
import Storage from './StorageControl';
import { Components } from 'expo';
import MapView from "react-native-maps";
import MyLocationMapMarker from './mylocationmark';
import { PermissionsAndroid } from 'react-native';
import { Permissions, Location } from 'expo';



const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
var inMapPage=false;

// var watchId;
export default  class screens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchId: null,
      cityName: "none",
      isPointReady: false,
      region:{},
      isRegionReady:false,
      markers:[],
      currentIndex:0,
      currentPosition:{},
      selfDiameter:10,
      isCurrentPositionReady:false,

    };
    this.animation = new Animated.Value(0);
    this.animation_config = this.animation_config.bind(this);
    this.get_points = this.get_points.bind(this);
    this.set_region = this.set_region.bind(this);
    this.getUserRealTimeLocation = this.getUserRealTimeLocation.bind(this);
    this.format_name = this.format_name.bind(this);
    this.myLocation = this.myLocation.bind(this);
  }

  componentDidMount() {
    console.log('Opening map page......');
    console.log(this.props.navigation.state.params.cityName);
    inMapPage=true;
    this.getLocationAsync();
    // this.requestCameraPermission();
    this.set_region();
    this.animation_config();
    this.get_points();
    this.getUserRealTimeLocation();

  }

  componentWillUnmount(){
    console.log('Leaving map page......');
    inMapPage = false;
    navigator.geolocation.clearWatch(this.state.watchId);
    
  }

  getUserRealTimeLocation(){

    this.state.watchId = navigator.geolocation.watchPosition(
      (position) => {
        // codes inside this block will be called when position Changed significantly
        this.setState({
          currentPosition:{
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,            
                            },
          isCurrentPositionReady:true, 
        });
        
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000},
      // { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, distanceFilter: 1 },
    );

  }

  set_region(){
    // set the initial region of the map to be the city's longitude and latitude 
    if(inMapPage){
      this.setState({
        region:{
          latitude: this.props.navigation.state.params.cityLat,
          longitude: this.props.navigation.state.params.cityLng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.040142817690068,
        },
        isRegionReady:true
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


  async get_points(){
    // get the name of the city from the parameter of StackNavigator
    var cityName = this.props.navigation.state.params.cityName;
    var pointsInCity = null;
    var isimageReady = false;
    await Storage.getItem('allPoints').then((allpoints) =>{
        // if "allPoints" recorder were found in AsyncStorage
        if(allpoints){
            pointsInCity = JSON.parse(allpoints)[cityName];
        }

    },(err) =>{
      console.log("Trying to get key 'allPoints' from asyncStorage...Error");
    });

    if (pointsInCity != null){
        for(var point in pointsInCity){
            await Storage.getItem('pImage' + '_'+ this.format_name(cityName) + '_' + pointsInCity[point].name).then((URI) =>{
                if(URI){
                    var imageURI = URI; //the base64 encoded image
                    pointsInCity[point]['img'] = imageURI;
                    isimageReady = true;
                }
            },(err) =>{
                console.log("Trying to get image of a point from asyncStorage...Error");
                console.log(err);
            });
        }

        if(inMapPage && isimageReady){
          allMarks=[];
          pointsInCity.map((item) =>{

            oneMark={
              coordinate: {
                latitude: item.lat,
                longitude: item.lng,
              },
              title: item.name,
              description: item.description,
              image: item.img,
              radius:item.radius,
            }

            allMarks.push(oneMark);

          })

          this.setState({
            markers:allMarks,
            isPointReady: true,
          })
        }
    }
}

async requestCameraPermission() {
  try {
    const granted =  PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Cool Photo App Camera Permission',
        'message': 'Cool Photo App needs access to your camera ' +
                   'so you can take awesome pictures.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  console.log(status);
};


  animation_config(){
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.state.currentIndex !== index) {
          this.state.currentIndex = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });

  }

  myLocation(){
    this.map.animateToRegion(
      {
        ...this.state.currentPosition,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta,
      },
      350
    );

  }


  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });

    if(this.state.isRegionReady && this.state.isPointReady && this.state.isCurrentPositionReady ){
      return (
         <View style={styles.container}>
           <View style={styles.myLocation}>
             <TouchableOpacity  onPress={this.myLocation}>
               <Image style={{
                  height:30,
                  width:30,
                  // radius
              }} source={require('../pictures/myLocation/myLocation.png')}>
              </Image>
              </TouchableOpacity>
          </View>
          <MapView ref={map => this.map = map} initialRegion={this.state.region} style={styles.container}>
              <MapView.Marker coordinate={this.state.currentPosition}>
                  <Animated.View >
                    <Image style={{
                        height:30,
                        width:30,
                        borderRadius:15,

                    }} source={require('../pictures/currentLocation/bluedot.gif')}>
                    </Image>
                      
                    {/* <View style={{width:20, height:20, backgroundColor: "rgba(63,104,238, 0.8)", borderRadius: 10,}} /> */}
                  </Animated.View>
              </MapView.Marker>


            {this.state.markers.map((marker, index) => {
              const scaleStyle = {
                transform: [{ scale: interpolations[index].scale,},],
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity,
              };
              return (
                <MapView.Marker key={index} coordinate={marker.coordinate}>
                  <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.ring, scaleStyle]} />
                    <View style={styles.marker} />
                  </Animated.View>
                </MapView.Marker>
              );
            })}
          </MapView>
          {/* <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [{ nativeEvent: {contentOffset: {x: this.animation}}}],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}>
  
              {this.state.markers.map((marker, index) => (
                <View style={styles.card} key={index}>
                  <Image
                    // source={marker.image}
                    source={{uri:"data:image/jpg;base64,"+marker.image}}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
                  </View>
                </View>
              ))}
  
          </Animated.ScrollView> */}
          <AudioContorler/>
  
        </View>
      );

    }else{
      return(
        <View style={{alignItems:'center', top:Dimensions.get('window').height/2 - 100}}>                    
                                    <ActivityIndicator size="large"/>
                                </View>

      )
      
    }

    
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex:1,
    position: "absolute",
    bottom: 30,
    // left: 0,
    // right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    // paddingRight: width - CARD_WIDTH,
    // paddingVertical: CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  myLocation: {
    flex:1,
    padding:5,
    position: "absolute",
    bottom:CARD_HEIGHT + 100,
    right: 5,
    zIndex:99,
    borderRadius: 25,
    backgroundColor: "rgba(160,160,160, 0.8)",
  },
});