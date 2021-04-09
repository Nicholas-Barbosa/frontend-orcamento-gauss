import GenericClient from "./GenericClient"
// import ClientDTO from "../../pojo/ClientsDTO"
export default class ClienteWSClient {

    genericWSClient
    lastPage = 0
    count = 0;
    splittedArray = [];
    notSplittedArray = [];
    constructor() {
        this.genericWSClient = new GenericClient();
    }

    splitArrayInTwo(array, initialIndex) {
        this.splittedArray = [];
        let endInedx = 0;
        if (initialIndex == 0)
            endInedx = array.length / 2;
        else
            endInedx = array.length;

        console.log("from " +initialIndex+" to " +endInedx)
        for (let i = initialIndex; i < endInedx; i++) {
            console.log("for")
            this.splittedArray.push(array[i]);

        }
        console.log("split to return " +this.splittedArray)
        return this.splittedArray;
    }
    //10 -> 20 
    //20 -> 40
    getClientes(page, pageSize) {
        if (this.count == 0) {
            console.log("getClients")
            pageSize *= 2;
            let uri = `/clients?page=${page}&pageSize=${pageSize}`;
            //  let clientDTO = null;
            const promise = this.genericWSClient.doGet(uri).then(response => {
                this.count++;
                this.notSplittedArray = response.data.client;
                console.log("got response " + response.data)
                // clientDTO = new ClientDTO(response.data.address, response.data.code, response.data.store, response.data.state, response.data.table, response.data.cgc, response.data.blocked, response.data.name, response.data.fantasy_name, response.data.city);
                return this.splitArrayInTwo(this.notSplittedArray, 0);
            }).catch(error => {
                throw new Error("error " + error)
            });
            return promise;
        } else {
            this.count = 0;
           
           return this.splitArrayInTwo(this.notSplittedArray, (this.notSplittedArray.length / 2));
           
            //divide array
        }

    }
    getClientesByCodeAndLoja(code, loja) {

        let uri = `/clients/${code}/loja/${loja}`;

        return this.genericWSClient.doGet(uri);
    }
}