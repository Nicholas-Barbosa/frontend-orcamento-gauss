export default class ResponseProdutosDTO {

    products
    total_items
    total_page
    page_size
    page

    constructor(products, total_items, total_page, page_size, page) {
        this.products = products;
        this.total_items = total_items;
        this.total_page = total_page;
        this.page_size = page_size;
        this.page = page;
    }
}