const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const path = require('path')
const passport = require('passport')
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const multer = require('multer')
const clr = require('./src/app/lib/Color');
require('dotenv').config(); // Read .env

const PORT = process.env.PORT || 80;
const MONGO_SRV = process.env.MONGO_DB_DSN || undefined;
const secretOrKey = process.env.KEY || "confidential";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Init passport
app.use(passport.initialize())
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        require('./src/app/models/user').findById(jwt_payload.id)
        .then((user) => {
            if (user) {
                //clr.success("Passport "+user+"/"+jwt_payload.id+clr.Color.fg.cyan+" approved!"+clr.Color.reset);
                return done(null, user);
            }
            return done(null, false);
        })
        .catch((err) => clr.fail(err));
    })
);


// Multer - Process image requests
const itemImgStor = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/resources/media/item');
    },
    filename: (req, file, cb) => {
        cb(null, "ITEM"+new Date().getTime()+"_"+file.originalname)
    }
});

const validateFileMime = (req, file, cb) => {
    if( file.mimetype === 'image/png' ||
        file.mimetype === 'image/apng' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/bmp'
    ) {
        cb(null, true);
    } else cb(null, false);
}

app.use(multer({ storage: itemImgStor, fileFilter: validateFileMime }).single('image'));

// Header
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
    next();
});

// Publicly accessible static files
app.use("/images", express.static(path.join(__dirname, "src/resources/media")));
app.use("/js", express.static(path.join(__dirname, "src/resources/js")));
app.use("/css", express.static(path.join(__dirname, "src/resources/css")));

//Routes
const itemRoutes = require('./src/app/routes/items')
const authenticationRoutes = require('./src/app/routes/auth')

//Routing
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authenticationRoutes);

// Error handling
app.use((error, req, res, next) => {
    const E_STATUS = error.errorStatus || 500;
    const E_MESSAGE = error.message || "Internal server error";
    const E_DATA = error.data || null;
    res.status(E_STATUS).json({message: E_MESSAGE, data: E_DATA});
})

// Database connection
mongoose.connect(MONGO_SRV, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    clr.success("Connected to database");
    app.listen(PORT, ()=> clr.success("Server is running on port "+PORT));
})
.catch(err => {
    clr.fail("Cannot start server\n"+err)
})
