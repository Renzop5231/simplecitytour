import IP from './IPaddr';
import Storage from './StorageControl';

export default class CallBackend {

    // when you want to fire a post request without a jwt token
    static async post(path, data){
        var response   = [true] ;
        url = IP + path;
        await fetch(url, {
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(data),
            method: 'POST',
          }).then((backend_resp) => {
            response.push(backend_resp);
      
          }, (err) => { 
              response[0] = false;
              response.push(err);
          });

          return response

    }

// When you want to fire a post request with a jwt token: for endpoints that need to be authtication
    static async post_auth(path, data){
        var response   = [true] ;
        url = IP + path;
        auth_token = null;

        await Storage.getItem('token').then((resp) =>{
            if(resp){
                auth_token = resp;
            }
        }, (err) =>{
            console.log('Geting token from database...Error!');
            console.log(err.message);
        });

        if(auth_token != null){
            await fetch(url, {
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+ auth_token },
                body: JSON.stringify(data),
                method: 'POST',
            }).then((backend_resp) => {
                response.push(backend_resp);          
            }, (err) => { 
                  response[0] = false;
                  response.push(err);
            });
        }else{
            response.push('No Stored Token');

        }

          return response

    }


    // when you want to fire a get request 
    static async get(path){

        var response   = [true] ;
        url = IP + path;
        await fetch(url, {
            headers: {'Content-Type': 'application/json',},
            method: 'GET',
          }).then((backend_resp) => {
              response.push(backend_resp);
          }, (err) => { 
              response[0] = false;
              response.push(err.message);
          });

        //   the format of the data were returned: ['boolean','real response from backend'].
          return response

    }
}





// call backend examples

// These functions can be user when calling the backend, the format can be:

// import CallBackend from './CallBackend';  ------------ import this class in whatever file you want to call backend
// import IP from './IPaddr';
// example_get_request(){
//     path ='/api/get_stuff/';  //the url path
//     url = IP +path;

    // CallBackend.get(path).then((fetch_resp) =>{
    //     if (fetch_resp[0]){


    //       response = fetch_resp[1]-----------------------the real response from backend

            // console.log(response);
        

    //     }else{

    //       err = fetch_resp[1]------------------------------real err message from backend


    //     }

    //   },(err) =>{

            // this block was call when err ocour when call get/post in this file
            
    // });

// }








//get protected stuff from backend example:

// get_stuff_with_auth_token_from_backend() {
//     path ='/api/get_points/';  //the url path
//     url = IP +path;
//     data = {"key":'value'};
//     console.log('Getting stuff from server');
//     CallBackend.post_auth(path, data).then((fetch_resp) =>{
//         console.log('Retrieved backend respong');
//         if (fetch_resp[0]){
//             response = fetch_resp[1];
//             if(response === 'No Stored Token'){
//                 this.setState({
//                     isLogin: false,
//                     isReady: true,
//                 })
//                 alert('User Not Login');
            
//             }else{                    
//                 if (typeof JSON.parse(response._bodyText)['detail'] != "undefined") {
//                     if(JSON.parse(response._bodyText)['detail'] == 'Signature has expired.'){
//                         this.setState({
//                             isLogin: false,
//                             isReady: true,
//                         })
//                         console.log(JSON.parse(response._bodyText)['detail']);
//                         alert('Login expired');
//                     }   
//                 }else{ 
//                     if(typeof JSON.parse(response._bodyText) != "undefined") {
                    

//                         // console.log(JSON.parse(response._bodyText));
//                         // the expect value from backend
//                         backend_value      =    JSON.parse(response._bodyText);

//                     }
//                 }
//             }
            
//         }else{
//             err = fetch_resp[1];
//             if (err.message = 'Network request failed'){
//                 alert('Network failed.')
//             } else{
//                 alert("Login failed.")
//             }
//         }

//     },(err) =>{
//             console.log(err.message);
//             alert("Internal error.");		
//     });
// }