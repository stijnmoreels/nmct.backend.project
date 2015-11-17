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
var documentDb = require("./database/documentdb.js");
communication.listen(server);

// Anonymous login (can see map but can't add shares)
app.post('/login', function (request, response) {
    var user = {},
        sh1 = require("./crypto/hash.js");
    request.on('data', function (data) {
        Request.parseRequest(data, parseRequestCallback);
       
    }); function parseRequestCallback(error, data) {
        if (error) { throw error }
        
        var query = "SELECT * FROM users u WHERE u.username=@username AND u.password=@password";
        var parameters = [{
                name: "@username", value: data.username + ""
            }, {
                name: "@password", value: data.password + ""
            }];
        documentDb.query("users", { query: query, parameters: parameters }, signUserCallback);
    } function signUserCallback(error, user) {
        if (error) { throw error }
        else if (user.length == 0)
            // No user found
            response.json({ token: null, user: null, error: "No user found" });
        else if (user != null && user.length != 0)
            // We are sending the profile inside the token
            communication.sign(user, getToken);
    } function getToken(error, token) {
        if (error) { throw error }
        else response.json({ token: token, user: user });
    }
});

server.listen(9000, function () {
    console.log('listening on http://localhost:9000');
});