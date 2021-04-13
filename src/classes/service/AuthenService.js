import router from "../../router";
import httpAxiosService from "./client/HttpAxiosService";

class AuthenService {


    isAuthenticated() {
       
        return sessionStorage.getItem("accessToken") != null;
    }

    getAccessToken() {
        return sessionStorage.getItem("accessToken");
    }
    doLogin(user, password) {
        let uri = "api/oauth2/v1/token?grant_type=password&password=" + password + "&username=" + user;

        const promise = httpAxiosService.post(uri).then((response) => {
            sessionStorage.setItem("accessToken", response.data.access_token)
            sessionStorage.setItem("refreshToken", response.data.refresh_token)
            router.back();
            return response;
        })
           
    
        return promise;
    }
    doLogout(){
        this.invalidToken();
    }
    invalidToken() {
        sessionStorage.removeItem("accessToken");
        router.push("/login")

    }
}
const authService = new AuthenService();
export default authService;