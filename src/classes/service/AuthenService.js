import httpAxiosService from "./client/HttpAxiosService";

export default class AuthenService {


    static isAuthenticated() {
        return sessionStorage.getItem("accessToken") != null;
    }

    static getAccessToken() {
        return sessionStorage.getItem("accessToken");
    }
    static doLogin(user, password) {
        let uri = "api/oauth2/v1/token?grant_type=password&password=" + password + "&username=" + user;

        const promise = httpAxiosService.post(uri).then((response) => {
            sessionStorage.setItem("accessToken", response.data.access_token)
            sessionStorage.setItem("refreshToken", response.data.refresh_token)
            return response;
        }).catch(error => {
            return error;
        });
        return promise;
    }
}