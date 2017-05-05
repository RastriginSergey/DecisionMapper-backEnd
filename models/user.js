const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    createdBy: {type: Date, default: Date.now},
    firstName: String,
    lastName: String,
    facebookId: String,
    email: {type: String, unique: true, lowercase: true},
    password: String,
    favorites: Array
});

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err)
            }

            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err)
                }

                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    })
};

userSchema.statics.findOrCreate = function findOrCreate(query, cb) {
    const newUser = new this();
    this.findOne(query, function (err, user) {
        if (err) cb(err);

        if (user) {
            cb(null, user)
        } else {
            newUser.facebookId = query.facebookId;
            newUser.save(cb);
        }
    })
};

module.exports = mongoose.model('User', userSchema);