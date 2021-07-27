const { validationResult, query } = require('express-validator')
const Item = require('../models/item')
const Metric = require('../models/metric')
const Telemetry = require('../models/telemetry')
const passport = require('passport')
require('dotenv').config();

const env_metrics = process.env.METRICS || 'OFF';
const env_telemetry = process.env.TELEMETRY || 'OFF';

const clr = require('../lib/Color')

exports.getSeveralItems = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 30;

    var total;
    //Item.countDocuments().then(result => {total = result}).catch(err => {clr.fail(err)})
    Item.find().countDocuments()
    .then(result => {
        total = result;
        
        Item.find()
        .skip(parseInt((currentPage-1)*perPage))
        .limit(parseInt(perPage))
        .then(result => {
            res.status(200).json({
                status: 200,
                count: total,
                page: {
                    current: currentPage,
                    containing: perPage
                },
                data: result
            })
            clr.success(new Date()+": Served getSeveralItems: "+perPage+" items on page "+currentPage, 'get')
        })
        .catch(err => {
            clr.fail(new Date()+": Cannot serve getSeveralItems: "+perPage+" items on page "+currentPage, 'get')
            clr.fail(err)
        })
    })
    
    .catch(err => {
        clr.fail(new Date()+": Cannot serve getSeveralItems: "+perPage+" items on page "+currentPage, 'get')
        clr.fail(err)
    })
}

exports.getAllItems = (req, res, next) => {
    var total;
    Item.countDocuments().then(result => {total = result}).catch(err => {clr.fail(err)})
    Item.find()
    .then(result => {
        res.status(200).json({
            status: 200,
            count: total,
            data: result
        })
        clr.success(new Date()+": Served getAllItems", 'get')
    })
    .catch(err => {
        clr.fail(new Date()+": Cannot serve getAllItems", 'get')
        clr.fail(err)
    })
}

exports.getAllVisibleItems = (req, res, next) => {
    var total;
    Item.countDocuments({visibility: true}).then(result => {total = result}).catch(err => {clr.fail(err)})
    Item.find({visibility: true})
    .then(result => {
        res.status(200).json({
            status: 200,
            count: total,
            data: result
        })
        clr.success(new Date()+": Served getAllVisibleItems", 'get')
    })
    .catch(err => {
        clr.fail(new Date()+": Cannot serve getAllVisibleItems", 'get')
        clr.fail(err)
    })
}

exports.createItem = (req, res, next) => {
    const title = req.body.title;
    const tingkatan = req.body.tingkatan;
    const daerah = req.body.daerah;
    const description = req.body.description;
    const jenis = req.body.jenis;
    const tanggal = req.body.tanggal;
    const pelaksanaan = req.body.pelaksanaan;
    passport.authenticate('jwt', {session:false}, (err, user)=> {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            clr.fail("Error on itemController:createItem", 'post')
            const err = new Error('Invalid value');
            err.errorStatus = 400;
            err.data = errors.array()
            throw err;
        } else {
            // All clear
            let visible = (1 === 1)
            const newItemListing = new Item({
                title: title,
                tingkatan: tingkatan,
                daerah: daerah,
                description: description,
                authorId: user.id,
                jenis: jenis,
                pelaksanaan: pelaksanaan,
                tanggal: tanggal,
                visibility: visible,
                comment: [],
                view: 0
            })

            newItemListing.save()
            .then(result => {
                clr.success(new Date()+": Item "+result.id+" by "+user.id+" created", 'post')
                const newItemMetrics = new Item({
                    itemId: result.id,
                    views: 0,
                    engagementPoints: 0
                })
                newItemMetrics.save()
                .then(met_result => {
                    clr.info("Created metrics file")
                })

                res.status(201).json({
                    status: 201,
                    data: {
                        itemId: result.id,
                        itemAuthor: user.id,
                        itemStatus: "Posted",
                        isItemVisible: visible
                    }
                });
            })
            .catch(err => {
                clr.fail(new Date()+": Item failed to post", 'post')
                clr.fail(err)
                res.status(400).json(err)
                next()
            })  
        }
    }) (req, res, next)

    
}

exports.addImageData = (req, res, next) => {
    const itemId = req.body.itemId;

    if(!req.file) {
        clr.fail("Empty image request received on itemController:createItem", 'post')
        const err = new Error('Bad request');
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    }

    const image = req.file.path;

    Item.findById(itemId)
        .then(item => {
            if(!item) {
                const err = new Error('Item not found');
                err.errorStatus(404);
                throw err;
            } else {
                passport.authenticate('jwt', {session:false}, (err, user)=> {
                    if(user.id === item.authorId) {
                        item.imageURI = image;

                        return item.save()
                        .then(result => {
                            res.status(200).json({
                                status: 200,
                                itemId: item.id,
                                path: image,
                                message: "Updated"
                            })
                            clr.success(new Date()+": Image added on item ID "+itemId)
                            
                        })
                    } else {
                        res.status(403).json({status:403})
                        return 403;
                    }
                }) (req, res, next)
                
                
            }
        })
        
        .catch(err => {
            clr.fail("Cannot update item "+itemId, 'put')
            clr.fail(err)
            res.json(err)
        })
}

exports.getItemsById = (req, res, next) => {
    const itemId = req.params.itemId;
    //Item.findOne({id: itemId})
    Item.findByIdAndUpdate(itemId, {
        $inc: { view: 1 }
    })
    .then( result => {
        if(!result) {
            const err = new Error('Item not found')
            err.errorStatus(404)
            throw err
        
        } else {
            res.status(200).json({
                status: 200,
                data: result
            })

            
            if(env_metrics === 'ON') {
                Metric.findOneAndUpdate({ itemId: itemId }, {
                    $inc: { 'views': 1 }
                })
                .then(result => {
                    clr.info("Metrics posted")
                })
                clr.info("Metrics executed");
            }

            clr.success(new Date()+": Served item ID "+itemId)
        }
        
        
    })
    .catch(err => {
        clr.fail("Cannot serve item "+itemId, 'get')
        clr.fail(err)
    })

    
}

exports.getFilteredItems = (req, res, next) => {

    var query = {};
    query.visibility = true;
    if(req.body.title) query.title = { $regex: req.body.title, $options : 'i' };
    if(req.body.tingkatan) query.tingkatan = { $regex: req.body.tingkatan };
    if(req.body.daerah) query.daerah = { $regex: req.body.daerah };
    if(req.body.jenis) query.jenis = { $regex: req.body.jenis };
    if(req.body.tanggal) query.tanggal = req.body.tanggal;
    if(req.body.pelaksanaan) query.jenis = { $regex: req.body.pelaksanaan };
    if(req.body.authorId) query.authorId = req.body.authorId;
    //if(req.body.kategori) query = {"description.kategori": req.body.kategori};
    console.log(req.body)
    Item.find(query)
    .then( result => {
        if(!result) {
            const err = new Error('Item not found')
            err.errorStatus(404)
            throw err
        
        } else {
            res.status(200).json({
                status: 200,
                query: query,
                data: result.reverse()
            })
            clr.success(new Date()+": Served getFilteredItems", 'get')
        }
    })
    .catch(err => {
        clr.fail("Cannot serve item ", 'get')
        clr.fail(err)
    })

    
}

exports.updateItemById = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        clr.fail("Error on itemController:createItem", 'post')
        const err = new Error('Invalid value');
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    } else {
        // All clear
        const title = req.body.title;
        const tingkatan = req.body.tingkatan;
        const daerah = req.body.daerah;
        const description = req.body.description;
        const jenis = req.body.jenis;
        const tanggal = req.body.tanggal;
        const pelaksanaan = req.body.pelaksanaan;
        const itemId = req.params.itemId;

        

        Item.findById(itemId)
        .then(item => {
            if(!item) {
                const err = new Error('Item not found');
                err.errorStatus(404);
                throw err;
            } else {
                passport.authenticate('jwt', {session:false}, (err, user)=> {
                    if(user.id === item.authorId) {
                        item.title = title;
                        item.tingkatan = tingkatan;
                        item.daerah = daerah;
                        item.pelaksanaan = pelaksanaan;
                        item.description = description;
                        item.jenis = jenis;
                        item.tanggal = tanggal;

                        return item.save()
                        .then(result => {
                            res.status(200).json({
                                status: 200,
                                itemId: itemId,
                                message: "Updated"
                            })
                            clr.success(new Date()+": Updated item ID "+itemId)
                            
                        })
                    } else {
                        res.status(403).json({status:403})
                        return 403;
                    }
                }) (req, res, next)
                
                
            }
        })
        
        .catch(err => {
            clr.fail("Cannot update item "+itemId, 'put')
            clr.fail(err)
            res.json(err)
        })
    }
    
}

exports.removeItem = (req, res, next) => {

    passport.authenticate('jwt', {session:false}, (err, user)=> {
        clr.info(user)
        if(user.role === 'admin' || user.role === 'moderator') {
            const itemId = req.params.itemId;

            Item.findById(itemId)
            .then(item => {
                if(!item) {
                    const err = new Error('Item not found');
                    err.errorStatus(404);
                    throw err;
                } else {
                    item.visibility = false;
                    return item.save();
                }
            })
            .then(result => {
                res.status(200).json({
                    status: 200,
                    itemId: itemId,
                    message: "'Removed'"
                })
                clr.warn(new Date()+": Item ID "+itemId+" marked as removed", 'put')
            })
            .catch(err => {
                clr.fail("Cannot mark item "+itemId+" as removed", 'put')
                clr.fail(err)
            })
        } else {
            const err = new Error("Forbidden");
            err.errorStatus = 403;
            err.message = "Forbidden"
            clr.warn("Caught forbidden access on removeItem by "+user.email)
            clr.info(user.role)
            res.status(403).json({status:403})
            throw err;
            
        }
    }) (req, res, next)

    
    
}

exports.submitComment = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        const payload = req.body.comment;
        const itemId = req.body.itemId;

        /*
        * Payload schema
        * {
        *   userId: string,
        *   comment: string
        * }
        */

        Item.findById(itemId)
        .then(item => {
            if(!item) {
                const err = new Error('Item not found');
                err.errorStatus(404);
                throw err;
            } else {

                if(payload && payload.userId && payload.comment) {
                    payload.downvotes = 0;
                    payload.upvotes = 0;
                    payload.child = [];
                    item.comment.push(payload)

                    item.save()

                    res.status(200).json({
                        status: 200,
                        itemId: itemId,
                        message: "Replied"
                    })
                    clr.success(new Date()+": Replied item ID "+itemId)
                    
                    
                }
            }
        })
        
        .catch(err => {
            clr.fail("Cannot update item "+itemId, 'put')
            clr.fail(err)
            res.json(err)
        })
    }) (req, res, next)
}

exports.removeComment = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        
    }) (req, res, next)
}

exports.replyComment = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        
    }) (req, res, next)
}

exports.upvoteComment = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        
    }) (req, res, next)
}

exports.downvoteComment = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        
    }) (req, res, next)
}