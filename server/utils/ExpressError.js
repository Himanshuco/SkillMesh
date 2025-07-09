class ExpressError extends Error {
    constructor(statusCode, message) {
        super();       // Pass message to Error constructor
        this.statusCode = statusCode;  // use lowercase s
        this.message = message;
    }
};
module.exports = ExpressError;
