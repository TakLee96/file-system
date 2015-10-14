'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');

var app = express();

app.get('/list', function (req, res) {
    var dir = req.query.dir;
    console.log("Getting: %s", dir);
    fs.readdir(dir, function (err, files) {
        if (err) throw err;
        files = files.filter((file) => file[0] != '.');
        var length = files.length;
        var resultFiles = [], resultDirectories = [];
        for (let file of files) {
            fs.stat(path.join(dir, file), function (err, stats) {
                if (err) throw err;
                else if (stats.isDirectory()) {
                    resultDirectories.push(file);
                } else if (stats.isFile()) {
                    resultFiles.push(file);
                }
                if (!--length) {
                    res.status(200).json({files: resultFiles.sort(), directories: resultDirectories.sort()}).end();
                }
            });
        }
    });
});

app.use(express.static('public'));

app.listen(8080, function () {
    console.log("Listening on port %s", this.address().port);
});

