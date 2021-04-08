export default class TokenHolder{

     static token = null;

     static isAuthenticated(){
         return this.token != null;
     }
}