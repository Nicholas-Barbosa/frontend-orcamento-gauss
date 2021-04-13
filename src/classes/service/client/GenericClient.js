
import authService from "../AuthenService";
import httpAxiosService from "./HttpAxiosService";
class GenericClient {


    doPost(uri, responseBody) {
        const promise = httpAxiosService.post(uri, responseBody, {
            headers: {
                'Authorization': `Bearer ${authService.getAccessToken()}`
            }
        })
        
        return promise;
    }

    doGet(uri) {
        const promise =
            httpAxiosService.get(uri, {
                headers: {
                    'Authorization': `Bearer ${authService.getAccessToken()}`
                }
            })
        promise.catch(error => {
          
            this.checkStatus(error);
        })
        return promise;
    }

    checkStatus(error) {
        if(error.response)
        if (status == 401) {
            authService.invalidToken();
        }
    }
}
const genericClient = new GenericClient();
export default genericClient;