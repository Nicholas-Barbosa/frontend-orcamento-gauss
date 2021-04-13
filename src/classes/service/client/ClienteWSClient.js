import genericClient from "./GenericClient";
// import ClientDTO from "../../pojo/ClientsDTO"
export default class ClienteWSClient {

    


    getClientes(page, pageSize) {
        let uri = `/clients?page=${page}&pageSize=${pageSize}`;
        return genericClient.doGet(uri);
    }
    getClientesByCodeAndLoja(code, loja) {

        let uri = `/clients/${code}/loja/${loja}`;

        return genericClient.doGet(uri);
    }
}