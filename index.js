const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport')
const mongoose = require('mongoose');

const app = express();

const users = require('./routes/users');

//Set-up Cross-Origin Resource Sharing
app.use(cors());
app.options('*', cors());

//Parsers
app.use(express.json()); //Parse json bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.use('/users', users);

const PORT = process.env.PORT || 5000;

app.get('*', (req, res) => {
    res.send("Invalid Endpoint");
});


//Start Server
app.listen(PORT, () => {
    console.log('Server started on PORT ' + PORT)
});
