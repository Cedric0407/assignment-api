var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imagePath: String,
    role: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');