export default class MessagePojo{

    static lastId=0;
    constructor(severity,content){
        this.severity = severity;
        this.content = content;
        this.id = ++this.lastId;
    }
}