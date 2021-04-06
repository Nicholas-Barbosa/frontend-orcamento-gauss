

export default class ItemPedido{

   
    descricao;
    tipo;
    codComercial;
    cod_produto

    constructor(descricao,tipo,codComercial,quantidade){
        this.descricao = descricao;
        this.tipo = tipo;
        this.cod_produto = codComercial;
        this.quantidade = quantidade;
    }
}