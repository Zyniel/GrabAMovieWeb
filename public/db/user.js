var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, unique: true},
    password: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
            return cb(err);
        callback(null, isMatch);
    });
};

mongoose.model('User', userSchema);