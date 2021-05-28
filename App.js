const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const path = require('path')
const passport = require('passport')
const clr = require('./src/app/lib/Color');
require("./src/app/middleware/Passport")(passport);
require('dotenv').config();

const SESSION_LIFETIME = 1000*60*60*12; // 12 hours
const PORT = process.env.PORT || 80;
const MONGO_SRV = process.env.MONGO_DB_DSN || undefined;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
    next();
});

app.use("./src/resources/media", express.static(path.join(__dirname, "images")));
app.use("./src/resources/js", express.static(path.join(__dirname, "js")));
app.use("./src/resources/css", express.static(path.join(__dirname, "css")));

app.use(passport.initialize());

//Routes
const itemRoutes = require('./src/app/routes/items')
const authenticationRoutes = require('./src/app/routes/auth')

app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/auth', authenticationRoutes);

app.use((error, req, res, next) => {
    const E_STATUS = error.errorStatus || 500;
    const E_MESSAGE = error.message || "Internal server error";
    const E_DATA = error.data || null;
    res.status(E_STATUS).json({message: E_MESSAGE, data: E_DATA});
})

mongoose.connect(MONGO_SRV, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    clr.success("Connected to database");
    app.listen(PORT, ()=> clr.success("Server is running on port "+PORT));
})
.catch(err => {
    clr.fail("Cannot start server\n"+err)
})
