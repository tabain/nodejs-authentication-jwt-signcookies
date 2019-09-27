const mongoose = require('mongoose');  
const bcrypt = require('bcrypt-nodejs');
const user = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {type: String, required: true},    
	fullName: {type: String, required: true},
	username:{type: String, required: true},
	password: {type: String, required: true}
});


user.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});
user.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
/*User.schema.path('email').validate(function (value) {
    var isValidEmail = verifyEmailAddress(value);
    return isValidEmail;
}, 'Invalid email');
function verifyEmailAddress(email){
    if(email.indexOf('+')==-1){
        if(validateEmail(email)){
            return true;
        }
        else {
            //Invalid email
            return false;
        }
    }
    else {
        // Sub addressed email
        return false;
    }
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}*/
module.exports = mongoose.model('User', user);
