const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePathLogs = path.join(directory, 'logs.txt')
const filePathPongs = path.join(directory, 'pongs.txt')
const filePathImage = path.join(directory, 'image.jpeg')

module.exports = {
    'pathLogs': filePathLogs.toString(),
    'pathPongs': filePathPongs.toString(),
    'pathImage': filePathImage.toString(),
}