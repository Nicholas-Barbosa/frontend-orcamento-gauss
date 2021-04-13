import genericClient from "./GenericClient";


export default class ProdutosWSClient {

 

    getProducts(page, pageSize) {
        let uri = `/products?page=${page}&pageSize=${pageSize}`;
        return genericClient.doGet(uri);

    }

    getProductByCode(code) {
        let uri = `/products/${code}`;
        return genericClient.doGet(uri);
    }
}