import httpAxiosService from "./HttpAxiosService";
import AuthenSerivce from "../AuthenService"
export default class GenericClient {

     authService = new AuthenSerivce();
    doPost(uri) {
        const response = httpAxiosService.post(uri, {
            headers: {
                'Authorization': `Bearer ${this.authService.getAccessToken()}`
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
                'Authorization': `Bearer ${this.authService.getAccessToken()}`
            }
        })
       
    }

    checkToken(status) {
        if (status == 401)
            sessionStorage.removeItem("accessToken");
    }
}