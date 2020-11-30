const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    }, 
    lastName: {
        type: String,
        trim: true,
    }, 
    job: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        minlength: 1,
        trim: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    }, 
    password: {
        type: String,
        minlength: 6,
        required: true
    }, 
    confirmed: {
        type: Boolean,
        default: false
    },
    tokens: [{
        access: {
            type: String,
            required: true
        }, 
        token: {
            type: String, 
            required: true
        }
    }]
})   

/****MongooseSchema methods */
UserSchema.methods.generateAuthToken = function () {
    let user = this
    const access = 'auth'
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString()

    user.tokens = user.tokens.concat([{access, token}]) 
    
    return user.save().then(() => {
        return token
    })  
}

UserSchema.methods.removeToken = function (token) {
    const user = this

    return  user.update({
        $pull: {
            tokens: {
                token
            }
        }
    })
}


/******MongooseSchema statics */
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({ email }).then(user => {

        return new Promise((resolve, reject) => {
            if (!user) {
                resolve('This account does not exist')
            }


            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    if (!user.confirmed) {
                        resolve('Please confirm your email to login')
                    } else {
                        resolve(user)
                    }
                    
                }
                else {
                    resolve('Wrong password')
                }
            })
        })
    })
}

UserSchema.statics.findByToken = function (token) {
    const User = this

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch(e) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findExistingEmail = function (email) {
    const User = this

    return User.findOne({ email }).then(user => {
        return new Promise((resolve, reject) => {
            if (user) {
                resolve('User already exists')
            } else {
                resolve(null)
            }
        })
    }).catch(e => {
        console.log(e)
    })
}

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) next()

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    });
})

const User = mongoose.model('User', UserSchema);

module.exports = { User };