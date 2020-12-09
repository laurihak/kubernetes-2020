const fs = require('fs');
const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pongs.txt')

const savePongsToFile = (numberOfGets) => {
    fs.mkdir(directory, { recursive: true }, function (err) {
        if (err) console.log('makingDirectory error: ' + err.message)
        else {
            console.log('started writing to file');
            try {
                fs.writeFileSync(filePath,'pong: ' + numberOfGets)
                } catch (e) {
                    console.log(e);
                }
            }
    })
}

exports.savePongsToFile = savePongsToFile;