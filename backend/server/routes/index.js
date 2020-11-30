require('../config/config')

const { Router } = require('express')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const { User } = require('../models/user')
const { authenticate } = require('../middleware/authenticate')
const { mongoose } = require('../db/mongoose')
const { models } = require('mongoose')

const router = Router()

/*****Register Route */
router.post('/register', async (req, res) => {
    let body = _.pick(req.body, ['firstName', 'lastName', 'job', 'email', 'password'])

    try {
        const action = await User.findExistingEmail(body.email)
        if (action) {
            return res.send(action)
        }
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

    const user = new User({
        firstName: body.firstName,
        lastName: body.lastName,
        job: body.job,
        email: body.email,
        password: body.password
    })

    try {
        await user.save()
    } catch(e) {
        console.log(e)
        res.status(404). send(e)
    }

    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.email,
    //         pass: process.env.pass
    //     },
    //     debug: false
    // })

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'omoruyi.isaac97@gmail.com',
            clientId: process.env.clientId,
            // clientId: '788330544216-5j1ff50hcf5q4sh5jqhdclnud8hdfk3v.apps.googleusercontent.com',
            clientSecret: process.env.clientSecret,
            // clientSecret: 'P7bou5M1ZWVMiQrBLBRxrjkF',
            refreshToken: "1//04n8f7QF2-r5VCgYIARAAGAQSNwF-L9IrNCKbeUGT4uedFGG9Y9OjtP_UxCepoqBlHZTgt1QE5V6rRK4GH9XcB8kqFYEPj5f39XU",
        }
    });

    let newUrl 
    
    jwt.sign(
        {
            _id: user._id.toHexString()
        }, 
        process.env.EMAIL_SECRET,
        {
            expiresIn: '1d'
        },
        (err, emailToken) => {
            const url = `https://kisso-challenge-server.herokuapp.com/confirmation/${emailToken}`
            
            transporter.sendMail({
                to: user.email,
                subject: 'Confirm email',
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
            })
        }
    )

    res.send('Confirmation email has been sent to you')
})

/******Email Confirmation Route */
router.get('/confirmation/:token', async (req, res) => {
    try {
        const { _id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET)
        const user = await User.findOne({ _id })
        user.confirmed = true
        user.save()
    } catch(e) {
        console.log(e)
        res.send('error')
    }

    return res.redirect('https://kisso-challenge.herokuapp.com/')
})

/*****Login Route */
router.post('/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password).then(user => {
        if (!user._id || user == 'Please confirm your email to login') {
            return res.send(user)
        } else {
            return user.generateAuthToken().then((token) => {
                let response = _.pick(user, ['firstName', 'lastName', 'email', 'job'])
                response.token = token
                res.header('authorization', token).send(response)
            })
        }
    }).catch(e => {
        res.status(400).send(e)
    })
})

/*****Reset Password Route */
router.post('/reset', (req, res) => {
    const body = _.pick(req.body, ['password', 'newPassword'])
    const token = req.header('authorization').split(' ')[1]

    User.findByToken(token).then(user => {
        if (!user) {
            return Promise.reject()
        }

        bcrypt.compare(body.password, user.password, (err, result) => {
            if (result) {
                user.password = body.newPassword
                user.save().then(() => {
                    res.send('Your password has been changed successfully')
                }).catch(e => res.status(400).send(e))
            }
            else {
                res.send('Invalid password')
            }
        })
    }).catch(e => {
        console.log(e)
        res.status(401).send(e)
    }) 
})

router.get('/authenticate', async (req, res) => {
    console.log('woop')
    try {
        const token = req.header('authorization').split(' ')[1]

        const user = await User.findByToken(token)
        console.log('chee')
        if (user._id) {
            res.send('Valid token')
        }
    } catch (e) {
        res.status(401).send(e)
    }
})

/*****Get User Route */
router.get('/user', authenticate, (req, res) => {
    try {
        const userDetails = _.pick(req.user, ['firstName', 'lastName', 'job', 'email', '_id'])
        res.send(userDetails)
    } catch (e) {
        res.status(400).send(e)
    }
})

/*****Get Users Route */
router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.aggregate([{ $match: {} }, { $project: { firstName: '$firstName', lastName: '$lastName', email: '$email', job: '$job'}}])
        res.send(users)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

/*****Delete User Route */
router.delete('/user', authenticate, async (req, res) => {
    try {
        const body = _.pick(req.body, ['_id'])

        const deletedUser = await User.findOneAndRemove({ _id: body._id })
        
        res.send(deletedUser)
    } catch (e) {
        res.status(400).send(e)
    }
})

/*****Signout Route */
router.get('/logout', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        res.status(200).send('successful')
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
});

module.exports = {
    router
}