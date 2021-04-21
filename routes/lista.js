const express = require('express');
const app = express();
const DATA = require('../data')

app.get("/lista", (req, res) => {
    res.send(DATA);
});

module.exports = app;