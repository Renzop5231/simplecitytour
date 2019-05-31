// import IP from './IPaddr';
import Storage from './StorageControl';
import CallBackend from './CallBackend';
// import { AsyncStorage } from './C:/Users/keson/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/react-native';
// import { AdSupportIOS } from './C:/Users/keson/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/react-native';

export default class PreDownload {
   static getCityImgs() {
        // path = '/app/get_imgs/';
        // CallBackend.get(path).then((fetch_resp) =>{
        //     if (fetch_resp[0]){
        //         response = fetch_resp[1];
        //         if (typeof JSON.parse(response._bodyText)!= "undefined") {
        //             imgInfo = JSON.parse(response._bodyText);
        //             for (var key in imgInfo) {
        //                 if (imgInfo.hasOwnProperty(key)) {
        //                     Storage.saveItem(key, imgInfo[key]);
        //                     console.log("City image of \""+ key + "\" were saved.");
        //                 }
        //             }
        //         }
        //     }else{
        //         err = fetch_resp[1];
        //         if (err.message = 'Network request failed'){
        //             console.log('Network failed when fetching images.')
        //         } else{
        //             console.log("failed when fetching images.")
        //         }
        //     }

        // },(err) =>{
        //     console.log('promise rejected.');
        // });

    }



















    // static getTypes() {
    //     path = '/app/types/';


    //     CallBackend.get(path).then((fetch_resp) =>{
    //         if (fetch_resp[0]){
    //             response = fetch_resp[1];
    //             console.log(response);
    //             if (false && typeof JSON.parse(response._bodyText)!= "undefined") {
    //                 console.log(JSON.parse(response._bodyText));
    //                 console.log(typeof JSON.parse(response._bodyText));
    //             }
    //         }else{
    //             err = fetch_resp[1];
    //             if (err.message = 'Network request failed'){
    //                 console.log('Network failed when fetching images.')
    //             } else{
    //                 console.log("failed when fetching images.")
    //             }
    //         }

    //     },(err) =>{
    //         console.log('promise rejected.');
    //     });

    // }zz




    static getLocations() {
        path ='/app/get_all_locations/';

        // fire a get request to CallBackend
        CallBackend.get(path).then((fetch_resp) =>{
            if (fetch_resp[0]){
                response = fetch_resp[1]
                if (typeof JSON.parse(response._bodyText) != "undefined") {

                    Storage.saveItem("citySequence", JSON.parse(response._bodyText)['citySequence']);
                    locationObject      =    JSON.parse(response._bodyText);
                    delete locationObject['citySequence'];
                    Storage.saveItem("allLocations", JSON.stringify(locationObject));
                    console.log("All names of all locations were saved.");
                }
            }else{
                err = fetch_resp[1]
                if (err.message = 'Network request failed'){
                    console.log('Network failed when fetching locations.')

                } else{
                    console.log("failed when fetching locations.")
                }

            }

        });
    }

    static format_name(name){
        if (name.includes(',')){
          index = name.indexOf(',');
          return name.substring(0,index)
        }
        return name
    }


    static getPoints() {
        path ='/app/get_points/';
        console.log('Getting points from server');
        CallBackend.get(path).then((fetch_resp) =>{
            if (fetch_resp[0]){
                response = fetch_resp[1];
                // console.log(response);
                console.log(response._bodyText)
                if(response._bodyText.substring(0,1) != '<' && typeof JSON.parse(response._bodyText) != "undefined") {

                    Storage.saveItem("pointSequence", JSON.parse(response._bodyText)['pointSequence']);

                    //An dict including all points of all cities, the key of dict is the name of a city
                    pointsOfAll      =    JSON.parse(response._bodyText);
                    delete pointsOfAll['pointSequence'];
                    for (var cityName in pointsOfAll) {
                        if (pointsOfAll.hasOwnProperty(cityName)) {

                            pointsInCity = pointsOfAll[cityName]; // An array including all points objects in a city

                            if(pointsInCity.length > 0){
                                for(var point in pointsInCity){
                                    pointURI = pointsInCity[point].img; //the base64 encoded image
                                    Storage.saveItem('pImage' + '_'+ this.format_name(cityName) + '_' + pointsInCity[point].name , pointURI);
                                    console.log("Point image \""+ this.format_name(cityName)+'_'+pointsInCity[point].name + "\" were saved.");

                                    // delete it after storing the base64 encoded image, cause AsyncStorage only support 2MB for one item
                                    delete pointsInCity[point]['img'];
                                }

                            }

                        }
                    }
                    // store all point info without image of points, in string format. the json format of allPoints looks like:
                    // {city1: ['point1':{'name':'','lat':'','lng':''},'point2':{'name':'','lat':'','lng':''},] city2: ['point1':{'name':'','lat':'','lng':''},'point2':{'name':'','lat':'','lng':''},]}
                    Storage.saveItem("allPoints", JSON.stringify(pointsOfAll));
                    console.log("All Points info of all cities were saved.")



                }else{
                    console.log('Fail to get points from server.');
                }
            }else{
                err = fetch_resp[1]
                if (err.message = 'Network request failed'){
                    console.log('Network failed when fetching locations.')

                } else{
                    console.log("failed when fetching locations.")
                }
            }
        });
    }


}
