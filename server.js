const express = require('express');
const axios = require('axios');
const http = require("http");
const https = require('https');
const cron = require('node-cron');
const fs = require('fs');

var config = require('./config.json');
var websites = require('./sites.json');

const app = express()
const port = 8686

require('console-stamp')(console, 'HH:MM:ss.l');

cron.schedule('*/10 * * * *', () => {
    test()
})

app.use(express.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
    console.log("== received GET request for /");

    res.status(200).sendFile(__dirname, 'index.html')
})

function sendTextMessage(url) {
    axios.post(config["url"], {
        number: config["phone"],
        message: `${url} is unavailble`
    })
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}

function checkWebsite(url) {
    https.get(url, function(res) {
        console.log(url, res.statusCode);
        res.statusCode !== 200;

        if(res.statusCode === 502) {
            sendTextMessage(url)
        }
    })
    .on('error', function(e) {
        sendTextMessage(url)
    });     
}

function test(){
    websites.forEach(function(item, index, array) {
        var check = checkWebsite(item["url"]);
    })
}

app.listen(port, function () {
    console.log('Downtime Alerter listening on port 8686')
})