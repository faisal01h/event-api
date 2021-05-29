const { validationResult, query } = require('express-validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require ('jsonwebtoken')

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
                            visibility: true
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
            clr.fail("Email not found", 'post')
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
    /*
    *   TBD: Redact password from query result
    */
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

exports.getUserInfo = (req, res, next) => {
    /*
    *   TBD: Redact password from query result
    */
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
                data: result
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