import httpAxiosService from "./HttpAxiosService";
import AuthenSerivce from "../AuthenService"
export default class GenericClient {

    doPost(uri) {
        const response = httpAxiosService.post(uri, {
            headers: {
                'Authorization': `Bearer ${AuthenSerivce.getAccessToken()}`
            }
        }).then(response => { return response }).catch(error => {
            this.checkToken(error.response.status);
            return error;
        })
        return response;
    }

     doGet(uri) {
       return httpAxiosService.get(uri, {
            headers: {
                'Authorization': `Bearer ${AuthenSerivce.getAccessToken()}`
            }
        })
       
    }

    checkToken(status) {
        if (status == 401)
            sessionStorage.removeItem("accessToken");
    }
}