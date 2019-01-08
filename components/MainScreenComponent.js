// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Text, View, Button, StyleSheet, Image, TouchableOpacity,Dimensions } from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';

// export default class HomeScreenComponent extends Component {

//     static navigationOptions = {
//         title: 'Simple City Tour',
//     };

//     render() {
//         const {navigate} = this.props.navigation;
//         return (
//             <View style={styles.container}>

//                 <Image
//                     style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/2.5-20, marginBottom: 20}}
//                     source={require('./img/tour.jpeg')} 
//                 />

//                 <Text style={{fontWeight: 'bold', fontSize: 25}}>
//                     Welcome to Simple City Tours!
//                 </Text>
//                 <Text style={{fontSize: 15, marginBottom: 10, padding: 5}}>
//                     Our goal is to make a city that is simple enough to enjoy because you will be able to explore each city just a little bit more. 
//                 </Text>

//                 <TouchableOpacity 
//                 style={styles.button}
//                 onPress={() => navigate('Locations')} 
//                 >
//                 <Text style={{fontWeight: 'bold', fontSize: 20}}> TOUR LOCATIONS </Text>
//                 </TouchableOpacity>
                
//                 <View style={{flexDirection: 'row'}}>
//                 <TouchableOpacity 
//                 style={styles.button}
//                 onPress={() => navigate('Signup')}
//                 >
//                 <Text style={{fontWeight: 'bold', fontSize: 20}}> SIGN UP </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                 style={styles.button}
//                 onPress={() => navigate('Login')}
//                 >
//                 <Text style={{fontWeight: 'bold', fontSize: 20}}> LOG IN </Text>
//                 </TouchableOpacity>

//                 </View>

//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//     },
//     button: {
//         backgroundColor: 'yellow',
//         padding: 25,
//         marginBottom: 15,
//         marginHorizontal: 10,
//         borderRadius:20,
//   },
// });
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button, StyleSheet, Image, TouchableOpacity,Dimensions,Platform, FlatList } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class HomeScreenComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
      }
      
    
    static navigationOptions = {
        title: 'Simple City Tour',
    };

    // start() {
    //     var self = this;
    //     axios.get('http://35.164.12.249/app/get_all_locations/')
    //         .then(function (response) {
    //             self.setState({data: response.data})
    //         })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }
    render() {
        const {navigate} = this.props.navigation;

        // this.start();
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
                </View>

                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        backgroundColor:'#E8FFFF'
    },
    image:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2.5-30, 
        marginBottom: 15,
        // ...Platform.select({
        //     ios: {
        //         width: Dimensions.get('window').width,
        //         height: Dimensions.get('window').height/2.5-30, 
        //     },
        //     android: {
        //         width:200,
        //         height:100,

        //     },
        //   }),
    },
    textView:{
        flexDirection: 'column',
        alignItems:'center',
        // width:Dimensions.get('window').width,
        // ...Platform.select({
        //     ios: {
        //         padding: 25,
        //         marginBottom: 15,
        //     },
        //     android: {
        //         padding: 10,
        //         marginBottom: 10,

        //     },
        //   }),
    },
    buttonl:{
        marginHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'yellow',
        ...Platform.select({
            ios: {
                width:Dimensions.get('window').width/1.5,
                alignItems:'center',
                padding: 25,
                marginBottom: 15,
            },
            android: {
                width:180,
                // alignItems:'center',
                padding: 10,
                marginBottom: 10,

            },
          }),

    },
    button: {
        width:Dimensions.get('window').width/2.3,
        backgroundColor: 'yellow',
        marginHorizontal: 10,
        borderRadius: 20,
        
        ...Platform.select({
            ios: {
                alignItems:'center',
                padding: 25,
                marginBottom: 15,
            },
            android: {
                width:'auto',
                padding: 10,
                marginBottom: 10,

            },
          }),
    },
    titleText: {
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
                fontSize: 25,
                marginBottom: 10
            },
            android: {
                fontWeight: 'bold',
                fontSize: 15,
                marginBottom: 5,
            },
          }),

    },
    textContent: {
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