const express = require('express');
const bcrypt = require('bcrypt');
const { json } = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const clr = require('./src/app/lib/Color');
require('dotenv').config();

const SESSION_LIFETIME = 1000*60*60*12; // 12 hours
const PORT = process.env.PORT || 3000;
const MONGO_SRV = process.env.MONGO_DB_DSN || undefined;
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    name: 'sessid',
    cookie : {
        maxAge: SESSION_LIFETIME,
    },
    resave: false,
    saveUninitialized: false,
    secret: 'securesession'
}))

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
