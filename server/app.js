var express = require('express');
var fs = require('fs');
var app = express();
var path = require("path");

var event = new Date();


app.use(function (req, res, next) {

    var data =
        req.headers['user-agent'].replace(',', '') + ',' +
        event.toISOString() + ',' +
        req.method + ',' + 
        req.url + ',' +
        'HTTP/' + req.httpVersion + ',' +
        res.statusCode
    

    var newLine = "\r\n";

    // write your logging code here

    fs.appendFile('server/log.csv', newLine + data, function (err) {
        if (err) {
            throw err
        } else {
            console.log(newLine + data);
        }
    });

    next();
});

app.get('/', function (req, res) {
    // write your code to respond "ok" here
    console.log('test');
    res.status(200).send('ok');
});

app.get('/logs', function (req, res) {
    // write your code to return a json object containing the log data here
    fs.readFile('server/log.csv', 'utf8', function (err, data) {
        var array = data.split('\r\n');
        var headers = array[0].split(',');
        var allData = [];
        for (i = 1; i < array.length; i++) {
            var newArray = array[i].split(',')
            var obj = {
                [headers[0]]: newArray[0],
                [headers[1]]: newArray[1],
                [headers[2]]: newArray[2],
                [headers[3]]: newArray[3],
                [headers[4]]: newArray[4],
                [headers[5]]: newArray[5]
            }
            allData.push(obj);
        }
        res.json(allData);
    })
});


module.exports = app;
