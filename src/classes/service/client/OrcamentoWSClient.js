import httpAxiosService from "./HttpAxiosService";

export default class OrcamentoWSClient{

    processOrcamento(orcamento){
        return httpAxiosService.post("/estimate",orcamento,{
            auth:{
                username:"Mano.rep",
                password:"abc@123"
            }});
    }
}