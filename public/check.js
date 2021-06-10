const axios = require('axios');
const https = require('https');
var config = require('../config.json');

function sendTextMessage(url) {
    axios.post(config["url"], {
        number: config["phone"],
        message: `${url} is unavailable`
    })
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}

function checkWebsite(url, fail = 0) {
    https.get(url, function(res) {
        console.log(url, res.statusCode);
        res.statusCode !== 200

        if(res.statusCode === 502) {
            fail++
            if(fail < 10) {
                console.log(`Retrying ${url}`)
                checkWebsite(url, fail);
            } else {
                sendTextMessage(url);
            }
        }
    })
    .on('error', function(e) {
        if(fail< 10) {
            checkWebsite(url, fail);
        } else {
            console.log(`Retrying ${url}`)
            sendTextMessage(url);
        }
    });
}

function test(websites){
    websites.forEach(function(item, index, array) {
        checkWebsite(item['url'])
    });
}

module.exports = { test, checkWebsite };