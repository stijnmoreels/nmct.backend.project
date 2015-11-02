/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side 
 =============================================================================*/

var express = require('express');
var http = require('http');
var app = express();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

app.use(serveStatic('public/src', { 'index': ['index.html'] }));
app.use(bodyParser.json());

var server = http.createServer(app);

var Request = require("./http/request.js");
var communication = require('./socket/communication.js');
communication.listen(server);

// Anonymous login (can see map but can't add shares)
app.post('/login', function (request, response) {
    var user = {};
    request.on('data', function (data) {
        Request.parseRequest(data, parseRequestCallback);
        // We are sending the profile inside the token
        communication.sign(user, getToken);
    }); function parseRequestCallback(error, data) {
        if (error) { throw error }
        
        // TODO: get user from NoSQL
        user = data;
        user.id = 123;
        user.email = "john@doe.com";

    } function getToken(error, token) {
        response.json({ token: token, user: user });
    }
});

server.listen(9000, function () {
    console.log('listening on http://localhost:9000');
});