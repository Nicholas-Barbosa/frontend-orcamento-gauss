
 export default class Pedido{

    client
    store
    items

    constructor(cliente,loja,itens){
        this.client = cliente;
        this.store = loja;
        this.items = itens;
    }
}