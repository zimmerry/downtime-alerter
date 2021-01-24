const express = require('express');
const exphbs = require('express-handlebars')
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

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
    console.log("== received GET request for /");

    res.status(200).render('sitePage', {site: websites})
})

app.post('/addSite', function(req, res, next) {
    if(req.body && req.body.url) {
        websites.push({
            url: req.body.url
        });

        fs.writeFile(
            __dirname + '/sites.json',
            JSON.stringify(websites, null, 2),
            function(err, data) {
                if (err) {
                    console.log(" == err: ", err);
                    res.status(500).send("Error saving website to DB");
                } else {
                    res.status(200).send("Website successfully added.");
                }
            }
        )
    } else {
        res.status(400).send("Request body must contain 'url'.");
    }
});

app.post('/removeSite', function(req, res, next) {
    if(req.body && req.body.urlToRemove) {
        for(site in websites) {
            if(websites[site]["url"] == req.body.urlToRemove) {
                websites.splice(site, 1);
            }
        }
        fs.writeFile(
            __dirname + '/sites.json',
            JSON.stringify(websites, null, 2),
            function(err, data) {
                if(err) {
                    console.log(" == err: ", err);
                    res.status(500).send("Error removing website from DB");
                } else {
                    res.status(200).send("Website successfully removed.");
                }
            }
        )
    } else {
        res.status(400).send("Request body must contain 'urlToRemove'.");
    }
});

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
        checkWebsite(item["url"]);
    })
}

cron.schedule('*/10 * * * *', () => {
    test()
})

app.listen(port, function () {
    console.log('Downtime Alerter listening on port 8686')
})

