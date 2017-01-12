var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        userName: { type: String, unique: true, required: true, trim: true, lowercase: true },
        firstName: String,
        lastName: String,
        email: { type: String, unique: true, required: true, trim: true, lowercase: true },
        password: String,
        role: { type: String, enum: ['admin', 'user'] },
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);