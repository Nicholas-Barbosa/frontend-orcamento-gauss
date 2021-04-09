export default class Client {

    constructor(address,
        code,
        store,
        state,
        table,
        cgc,
        blocked,
        name,
        fantasy_name,
        city) {
        this.address = address;
        this.code = code;
        this.store = store;
        this.state = state;
        this.table = table;
        this.cgc = cgc;
        this.blocked = blocked;
        this.name = name;
        this.fantasy_name = fantasy_name;
        this.city = city
    }
}