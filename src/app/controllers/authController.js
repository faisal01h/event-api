const { validationResult, query } = require('express-validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const PasswordReset = require('../models/passwordResets')
const jwt = require ('jsonwebtoken')
const mail = require('nodemailer')

const clr = require('../lib/Color')

const SALTROUNDS = process.env.BCRYPT_SALROUNDS || 10;
const secretOrKey = process.env.KEY || "confidential";

/*
* Register endpoint handler
* @route POST api/v1/auth/register
* @access Public
*/
exports.register = (req, res, next) => {
    const err = validationResult(req);
    if(!err.isEmpty()) {
        clr.fail("Error creating new account", 'post')
        const err = new Error('Invalid value');
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    } else {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;

        if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            clr.warn("Register: Email address "+email+" is invalid!");
            res.status(400).json({
                status: 400,
                message: "Email does not pass regex check"
            })
            next()
        } else clr.info(email+": Regex passing...", 'post')

        User.findOne({ email: email })
        .then(userExist => {
            if(userExist) {
                const err = new Error('User with email '+email+' already exists!');
                err.errorStatus = 400;
                throw err;
            } else {
                const defaultRole = "user";
                bcrypt.genSalt(SALTROUNDS, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        const hashedPasswd = hash;
                        clr.info(hashedPasswd)
    
                        const newUser = new User({
                            name: name,
                            email: email,
                            password: hashedPasswd,
                            role: defaultRole,
                            visibility: true,
                            myEvents: [],
                            savedEvents: []
                        })
    
                        newUser.save()
                        .then(result => {
                            res.status(201).json({
                                status: 201,
                                message: defaultRole+" "+email+" created successfully!",
                                data: {
                                    name: name,
                                    email: email,
                                    role: defaultRole
                                }
                            })
                            clr.success(new Date()+": Created "+defaultRole+" "+email+" ("+name+") ", 'post')
                        })
                        .catch(err=>{clr.fail(err)})
                    })
                })
            }
        })
        .catch(err=>{clr.fail(err)})
    }
}

exports.login = (req, res, next) => {
    const err = validationResult(req);
    if(!err.isEmpty()) {
        clr.fail("Error logging in", 'post')
        const err = new Error('Invalid value');
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    } else {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email: email })
        .then((found) => {
            if(!found) {
                const err = new Error('Forbidden');
                err.errorStatus = 403;
                throw err;
            } else {
                bcrypt.compare(password, found.password)
                .then((pwdMatch) => {
                    if(!pwdMatch) {
                        const err = new Error('Forbidden');
                        err.errorStatus = 403;
                        throw err;
                    } else {
                        const data = {
                            id: found._id,
                            name: found.name,
                            email: found.email
                        }

                        jwt.sign(
                            data,
                            secretOrKey,
                            {
                                expiresIn: 43200
                            },
                            (err, token) => {
                                res.json({
                                    token: "Bearer "+token,
                                    data
                                })
                            }
                        )

                        clr.success(new Date()+": "+found.email+" logged in ", 'post');

                        
                    }
                })
                .catch(error => {
                    clr.fail("Password mismatch", 'post')
                    clr.fail(error)
                    res.status(403).json({
                        status: 403,
                        data: error
                    })
                })
            }
        })
        .catch(error => {
            clr.fail("Email "+email+" not found", 'post')
            clr.fail(error)
            res.status(403).json({
                status: 403,
                data: error
            })
        })
    }
}

/*
* @access Authorized
*/
exports.getAllUsers = (req, res, next) => {
    var total;
    User.countDocuments().then(result => {total = result}).catch(err => {clr.fail(err)})
    User.find()
    .then(result => {
        res.status(200).json({
            status: 200,
            count: total,
            data: result
        })
        clr.success(new Date()+": Served getAllUsers", 'get')
    })
    .catch(err => {
        clr.fail(new Date()+": Cannot serve getAllUsers", 'get')
        clr.fail(err)
        res.status(500).json({status: 500})
    })
}

exports.getPublicUserInfo = (req, res, next) => {
    var query = {}
    if(req.body._id) query._id = req.query._id;
    // if(req.body.email) query.email = req.query.email;
    // if(req.body.name) query.name = {$regex: req.query.name}; 
    
    User.findById(req.query._id)
    .then(result => {
        
        if(!result) {
            const err = new Error('Not found');
            err.errorStatus = 404;
            throw err;
        } else {
            res.status(200).json({
                status: 200,
                data: result
            })
        }
        
    })
    .catch(err => {
        clr.fail("Cannot find user!")
        res.status(404).json({
            status:404, 
            data: err
        })
    })
}

exports.getUserInfo = (req, res, next) => {
    var query = {}
    if(req.body._id) query._id = req.body._id;
    if(req.body.email) query.email = req.body.email;
    if(req.body.name) query.name = {$regex: req.body.name}; 
    User.find(query)
    .then(result => {
        if(!result) {
            const err = new Error('Not found');
            err.errorStatus = 404;
            throw err;
        } else {
            res.status(200).json({
                status: 200,
                data: {
                    name: result[0].name,
                    email: result[0].email,
                    role: result[0].role,
                    createdAt: result[0].createdAt,
                    updatedAt: result[0].updatedAt,
                    visibility: result[0].visibility,
                    savedEvents: result[0].savedEvents,
                    myEvents: result[0].myEvents,
                    id: result._id
                }
            });
        }
        
    })
    .catch(err => {
        clr.fail("Cannot find user!")
        res.status(404).json({
            status:404, 
            data: err
        })
    })
}

exports.passwordReset = (req, res, next) => {
    const email = req.body.email;

    const resetToken = Math.random().toString(16).substr(2, 8).toUpperCase();

    const USERNAME = process.env.EMAIL_USERNAME
    const PASSWORD = process.env.EMAIL_PASSWORD

    User.find({ email: email })
    .then(result => {
        if(!result) {
            const err = new Error('Not found');
            err.errorStatus = 404;
            throw err;
        } else {
            bcrypt.genSalt(SALTROUNDS, (err, salt) => {
                bcrypt.hash(resetToken, salt, (err, hash) => {
                    const hashedToken = hash;
                    clr.info(hashedToken)
                    
        
                    const newReset = new PasswordReset({
                        userId: result[0]._id,
                        email: email,
                        tokenHash: hashedToken
                    })
                    newReset.save().then((response) => {
                        const transporter = mail.createTransport({
                            service: 'gmail',
                            auth: {
                              user: USERNAME,
                              pass: PASSWORD 
                            }
                        })
                    
                        const opts = {
                            from: USERNAME,
                            to: email,
                            subject: 'PromotBox: Password Reset Token',
                            html: `\
                            <html>\
                            <body>\
                                <div style="background-color: #EEEEEE; padding: 5px;"><h1>PromotBox</h1></div>\
                                <p>Kode reset password anda adalah: </p>\
                                <div>\
                                <code style="font-size:3rem">${resetToken}</code>\
                                </div>\
                                <br>\
                                <p>Jangan tunjukkan kode ini kepada siapapun. Pihak PromotBox tidak akan meminta kode ini.</p>\
                            </body>\
                            </html>\
                            `
                        }
                    
                        transporter.sendMail(opts, (error, info) => {
                            if(error) {
                                console.log(error)
                            } else {
                                console.log('Email sent: '+info.response)
                                res.status(200).json({
                                    info
                                })
                            }
                        })
                    }).catch(console.error)
                })
            })
        
        
            
        }
        
    })
    .catch(err => {
        clr.fail("Cannot find user!")
        res.status(404).json({
            status:404, 
            data: err
        })
    })

    
}

exports.processPasswordReset = (req, res, next) => {
    const token = req.body.token;
    const email = req.body.email;
    const newPassword = req.body.password;

    PasswordReset.findOne({ email: email })
        .then((found) => {
            if(!found) {
                const err = new Error('Forbidden');
                err.errorStatus = 403;
                throw err;
            } else {
                bcrypt.compare(token, found.tokenHash)
                .then((tokenMatch) => {
                    if(!tokenMatch) {
                        const err = new Error('Token mismatch');
                        err.errorStatus = 403;
                        throw err;
                    } else {

                        const generateTime = new Date(found.createdAt).getTime()
                        const now = new Date().getTime()

                        if(now - generateTime > 300000) {
                            res.status(401).json({
                                message: "Token expired"
                            })
                        } else {
                            

                            const data = {
                                id: found.userId,
                                email: found.email
                            }
                            res.status(200).json({
                                data
                            })
    
                            bcrypt.genSalt(SALTROUNDS, (err, salt) => {
                                bcrypt.hash(newPassword, salt, (err, hash) => {
                                    User.findByIdAndUpdate(found.userId, {
                                        password: hash
                                    }, (err, success) => {
                                        
                                    })
                                })
                            })
                        }

                        clr.success(new Date()+": "+found.email+" password reset ", 'post');

                        PasswordReset.deleteMany({ email: email }, (err)=>{
                            console.log(err)
                        })
                    }
                })
                .catch(error => {
                    clr.fail("Token mismatch", 'post')
                    clr.fail(error)
                    res.status(403).json({
                        status: 403,
                        data: error
                    })
                })
            }
        })
        .catch(error => {
            clr.fail("Email not found", 'post')
            clr.fail(error)
            res.status(403).json({
                status: 403,
                data: error
            })
        })
}

exports.changePassword = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        const oldPass = req.body.oldPass
        const newPass = req.body.newPassword

        bcrypt.compare(password, oldPass)
        .then((pwdMatch) => {
            if(!pwdMatch) {
                const err = new Error('Forbidden');
                err.errorStatus = 403;
                throw err;
            } else {

                if(oldPass !== newPass) {
                    bcrypt.genSalt(SALTROUNDS, (err, salt) => {
                        bcrypt.hash(newPass, salt, (err, hash) => {
                            User.findByIdAndUpdate(user.id, {
                                password: hash
                            }, (err, success) => {
                                
                            })

                            res.status(200).json({
                                message: "Password changed!"
                            })
                        })
                    })
                }

            }
        })

    }) (req, res, next)
}