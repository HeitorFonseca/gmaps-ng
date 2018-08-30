const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
const environment = {
  production: {
    uri: "mongodb://mongo/Hidrofito", // Databse URI and database name
    secret: crypto, // Cryto-created secret
    db: "Hidrofito", // Database name
    port: 3000
  },
  development: {
    uri: "mongodb://localhost/Hidrofito", // Databse URI and database name
    secret: crypto, // Cryto-created secret
    db: "Hidrofito", // Database name
    port: 3000
  }

}

module.exports = environment[process.env.NODE_ENV]