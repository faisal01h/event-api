const { validationResult } = require('express-validator')
const Item = require('../models/item')

const clr = require('../lib/Color')

exports.getAllItems = (req, res, next) => {
    clr.success(new Date()+": Served getAllItems", 'get')
    res.json({
        status: 200,
        content: [
            {
                id: 1,
                image: "http://www.imageurl.com/image.jpg",
                title: "Seminar A",
                tingkatan: {
                    SD: true,
                    SMP: true,
                    SMA: true,
                    MHS: true,
                    UMUM: true
                },
                daerah: {
                    Provinsi: "all",
                    Kabkot: "all",
                    Kecamatan: "all",
                },
                description: {
                    desc: "Ikuti seminar a",
                    rewards: null,
                }
            },
            {
                id: 2,
                image: "http://www.imageurl.com/image.jpg",
                title: "Kompetisi A",
                tingkatan: {
                    SD: false,
                    SMP: false,
                    SMA: true,
                    MHS: true,
                    UMUM: false
                },
                daerah: {
                    Provinsi: [
                        "Jawa Timur"
                    ],
                    Kabkot: [
                        "Surabaya",
                        "Sidoarjo"
                    ],
                    Kecamatan: "all",
                },
                description: {
                    desc: "Ikuti kompetisi a",
                    rewards: {
                        1: {
                            uang: 1000000,
                            sertifikat: true,
                            misc: "Pengalaman"
                        },
                        2: {
                            uang: 700000,
                            sertifikat: true,
                            misc: "Pengalaman"
                        },
                    },
                }
            },

        ]
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
        let itemId = 1;
        let authorId = 1;
        let visible = (1 === 1)
        const newItemListing = new Item({
            id: itemId,
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
        })

        
    }

    
}

exports.getItemsById = (req, res, next) => {
    clr.success(new Date()+": Served item ID "+req.body.id)
    res.sendStatus(200);
}

exports.updateItemById = (req, res, next) => {
    clr.success(new Date()+": Updated item ID "+req.body.id)
    res.sendStatus(200);
}

exports.removeItem = (req, res, next) => {
    clr.warn(new Date()+": Item ID "+req.body.id+" marked as removed", 'post')
    res.json(req.body);
}