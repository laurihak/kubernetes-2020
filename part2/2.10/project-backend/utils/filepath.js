const path = require('path');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePathImage = path.join(directory, 'image.jpeg')

module.exports = {
    'pathImage': filePathImage.toString(),
    'pathDir': directory.toString()
}