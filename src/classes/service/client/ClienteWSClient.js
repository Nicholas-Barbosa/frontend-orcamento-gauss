import GenericClient from "./GenericClient"
export default class ClienteWSClient {

    genericWSClient
    constructor() {
        this.genericWSClient = new GenericClient();
    }
    getClientes(page, pageSize) {

        let uri = "/clients?page=" + page + "&pageSize=" + pageSize;

        return this.genericWSClient.doGet(uri);
    }
    getClientesByCodeAndLoja(code,loja) {

        let uri = `/clients/${code}/loja/${loja}`;

        return this.genericWSClient.doGet(uri);
    }
}