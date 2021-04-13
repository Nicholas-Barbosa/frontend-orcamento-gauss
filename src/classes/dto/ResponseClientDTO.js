export default class ResponseClient{
    
    total_items
    client
    total_page
    page_size
    page

    constructor(total_item,client,total_page,page_size,page){
        this.total_items = total_item;
        this.client = client;
        this.total_page=total_page;
        this.page_size=page_size;
        this.page = page;
    }
}