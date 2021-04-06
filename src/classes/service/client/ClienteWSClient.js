import httpAxiosService from "./HttpAxiosService";

export default class ClienteWSClient {

    
    getClientes(page){

        let uri = "/clients?page="+page+"&pageSize=10";
          
        return  httpAxiosService.get(uri,{
            auth:{
                username:"Mano.rep",
                password:"abc@123"
            }
        }).then(response => response.data);
    }
}