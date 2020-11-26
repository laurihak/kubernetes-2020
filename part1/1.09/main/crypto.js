const crypto = require('crypto');

const secret = 'abc123'
const createHash = () => {
    const hash = crypto.createHmac('sha256', secret)
        .digest('hex');


    return hash;
}

module.exports = function printRndString(type) {
    const dateFormatted = new Date().toISOString()
    const message = (dateFormatted + ': ' + createHash());
    if (type === 'console') {
        console.log(message);
    } else {
        return message
    }
}

