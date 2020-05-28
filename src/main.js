const Sequelize = require("sequelize");

var express = require('express');
var app = express();

const db = new Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite",
});

db.authenticate()
    .then(() => {console.log("connected");})
    .catch(err => {console.error(err);})

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
