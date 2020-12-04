const crypto = require('crypto');

const fs = require('fs');
const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'logs.txt')


const secret = 'abc123'
const createHash = () => {
    const hash = crypto.createHmac('sha256', secret)
        .digest('hex');
    return hash;
}

module.exports = function printRndString() {
    const dateFormatted = new Date().toISOString()
    const message = (dateFormatted + ': ' + createHash());
    fs.mkdir(directory, { recursive: true }, function (err) {
        if (err) console.log('makingDirectory error: ' + err.message)
        else {
            console.log('started writing to file');
            try {
                fs.writeFileSync(filePath, message)
                } catch (e) {
                    console.log(e);
                }
            }
    })
}

