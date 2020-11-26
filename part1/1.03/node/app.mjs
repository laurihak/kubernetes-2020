import { createHash } from './randomstring.mjs';

function printRndString() {
    const dateFormatted = new Date().toISOString()
    console.log(dateFormatted,': ', createHash());
}

setInterval(printRndString, 5000);
