import { createHash } from './randomstring.mjs';

function printRndString(length) {
    const dateFormatted = new Date().toISOString()
    console.log(dateFormatted,': ', createHash());
}

setInterval(printRndString, 5000, 15);
