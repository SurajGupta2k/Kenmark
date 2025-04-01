const crypto = require('crypto');

// Generate a 64-byte random secret and convert it to hexadecimal format
const secretKey = crypto.randomBytes(64).toString('hex');

console.log('Your JWT_SECRET:', secretKey); 