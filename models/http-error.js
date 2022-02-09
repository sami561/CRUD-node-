class HttpError extends Error{
    constructor(message,errorCode ){
        super(message);//ADD a  "message "property
        this.code=errorCode;// Adds a "code " property 

    }
}
module.exports=HttpError;