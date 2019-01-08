import Storage from './StorageControl';
import CallBackend from './CallBackend';

export default class PreCkeck {
   static checkUpdate() {
        path = '/app/check_update/';
        CallBackend.get(path).then((fetch_resp) =>{
            if (fetch_resp[0]){
                // the real response from the backend
                response = fetch_resp[1];

                if (typeof JSON.parse(response._bodyText)!= "undefined") {
                    imgInfo = JSON.parse(response._bodyText)
                    for (var key in imgInfo) {
                        if (imgInfo.hasOwnProperty(key)) {
                            Storage.saveItem(key, imgInfo[key]);
                            console.log("Latest \""+ key + "\" were saved.");
                        }
                    }
                }
            

            }else{
                err = fetch_resp[1];
                if (err.message = 'Network request failed'){
                    console.log('Network failed when updating sequence.')
                } else{
                    console.log("failed when updating sequence.")
                }
            }

        },(err) =>{
            console.log('promise rejected.');            
        });

    }

}



