const { validationResult, query } = require('express-validator')
const Item = require('../models/item')

const clr = require('../lib/Color')

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

exports.createItem = (req, res, next) => {
    const title = req.body.title;
    const tingkatan = req.body.tingkatan;
    const daerah = req.body.daerah;
    const description = req.body.description;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        clr.fail("Error on itemController:createItem", 'post')
        const err = new Error('Invalid value');
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    } else {
        // All clear
        let itemId = 2;
        let authorId = 1;
        let visible = (1 === 1)
        const newItemListing = new Item({
            title: title,
            tingkatan: tingkatan,
            daerah: daerah,
            description: description,
            authorId: authorId,
            visibility: visible
        })

        newItemListing.save()
        .then(result => {
            clr.success(new Date()+": Item "+itemId+" by "+authorId+" created", 'post')
            res.status(201).json({
                status: 201,
                data: {
                    itemId: itemId,
                    itemAuthor: authorId,
                    itemStatus: "Posted",
                    isItemVisible: visible
                }
            });
        })
        .catch(err => {
            clr.fail(new Date()+": Item "+itemId+" by "+authorId+" failed to post", 'post')
            clr.fail(err)
            res.status(400).json(err)
            next()
        })  
    }

    
}

exports.getItemsById = (req, res, next) => {
    const itemId = req.params.itemId;
    //Item.findOne({id: itemId})
    Item.findById(itemId)
    .then( result => {
        if(!result) {
            const err = new Error('Item not found')
            err.errorStatus(404)
            throw err
        
        } else {
            res.status(500).json({
                status: 200,
                data: result
            })
            clr.success(new Date()+": Served item ID "+itemId)
        }
        
        
    })
    .catch(err => {
        clr.fail("Cannot serve item "+itemId, 'get')
        clr.fail(err)
    })

    
}

exports.getFilteredItems = (req, res, next) => {
    /*
    req body
    {
        "title": string or undefined
        "tingkatan": string or undefined
        "daerah": string or undefined
        "jenis": string "event"/"lomba"/"seminar" or undefined
    }
    */
    var query = {};
    if(req.body.title) query.title = { $regex: req.body.title };
    if(req.body.tingkatan) query.tingkatan = { $regex: req.body.tingkatan };
    if(req.body.daerah) query.daerah = { $regex: req.body.daerah };
    if(req.body.jenis) query.jenis = { $regex: req.body.jenis };
    
    clr.info(query);

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
                data: result
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
        const itemId = req.params.itemId;

        Item.findById(itemId)
        .then(item => {
            if(!item) {
                const err = new Error('Item not found');
                err.errorStatus(404);
                throw err;
            } else {
                item.title = title;
                item.tingkatan = tingkatan;
                item.daerah = daerah;
                item.description = description;

                return item.save();
                
            }
        })
        .then(result => {
            res.status(200).json({
                status: 200,
                itemId: itemId,
                message: "Updated"
            })
        })
        .catch()
    }
    clr.success(new Date()+": Updated item ID "+req.body.itemId)
}

exports.removeItem = (req, res, next) => {
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
    
}