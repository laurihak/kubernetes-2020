import crypto from'crypto';

const secret = 'abc123';

function createHash() {
   const hash = crypto.createHmac('sha256', secret)
                     .digest('hex');
                     

   return hash;
}
 export { createHash };
