/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS


// User Model Definition
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  nome: { type: String, required: true, lowercase: true },
  senha: { type: String, required: true},
  tipo: { type: String, required: true},
  hectaresContratados: { type: String}
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('senha'))
    return next();

  // Apply encryption
  bcrypt.hash(this.senha, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.senha = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function(senha) {
  return bcrypt.compareSync(senha, this.senha); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema);