import genericClient from "./GenericClient";
export default class OrcamentoWSClient{

    processOrcamento(orcamento){
        let uri = "/estimate"
        return genericClient.doPost(uri,orcamento);
    }
}