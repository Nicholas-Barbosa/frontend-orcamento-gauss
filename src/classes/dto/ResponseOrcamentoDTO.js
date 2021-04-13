export default class ResponseOrcamentoDTO{

    constructor(client_description, liquid_order_value, estimate,gross_order_value,quantity,stTotale) {
        this.client_description = client_description;
        this.liquid_order_value = liquid_order_value;
        this.estimate = estimate
        this.gross_order_value = gross_order_value
        this.quantity = quantity;
        this.stTotale = stTotale;
    }
}