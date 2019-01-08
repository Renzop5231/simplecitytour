import {AsyncStorage} from 'react-native';
import { Component } from 'react';
export default class Storage extends Component {
    static async saveItem(item, selectedValue) {
        try {
          await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
        }
      }

    static async getItem(item) {
        try {
          value = await AsyncStorage.getItem(item)
        } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
        }
        return value
    }

    static async removeItem(item) {
      try {
        value = await AsyncStorage.removeItem(item)
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }
      return value
  }

    static async compare(item1,item2) {
      try {
        value1 = await AsyncStorage.getItem(item1);
        value2 = await AsyncStorage.getItem(item2);
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }
      return value1===value2
  }

  static async getallkey() {
    try {
      value = await AsyncStorage.getAllKeys().then((result) => {
        console.log(result);
      })
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
    return value
  }

  static async clearAllData(){
    AsyncStorage.clear().then((success)=>{
      console.log('All AsyncStorage were clear');
    },(err)=>{
      console.log('Try to clear all AsyncStorage data..Error');
    });
  }


}