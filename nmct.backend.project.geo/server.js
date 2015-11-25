/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side (Run)
 =============================================================================*/

"use-strict";
var express = require('express'),
    http = require('http'),
    app = express(),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser');

// middleware
app.use(serveStatic('public/src', { 'index': ['index.html'] }));
app.use(bodyParser.json());

var server = http.createServer(app);

// sockets
var communication = require('./socket/communication.js'),
    documentDb = require("./database/documentdb.js");
communication.listen(server);

// login (can see map but can't add shares)
// because the socket communication is authorized
// the first communication between client - server
// has to come from ajax calls so the client can sign 
// the socket communication with his/hers token
app.post('/login', function (request, response) {
    var Request = require("./http/request.js"),
        user = {};
    request.on('data', function (data) {
        Request.parseRequest(data, parseRequestCallback);
    });
    
    // get the data from the POST and find the right user
    function parseRequestCallback(error, data) {
        // TODO: make "userExists"-method public in "Communication" so it can be used in here
        if (error) { throw error; }

        var query = "SELECT * FROM users u WHERE u.username=@username AND u.password=@password";
        var parameters = [{
                name: "@username", value: data.username + ""
            }, {
                name: "@password", value: data.password + ""
            }];
        documentDb.query("users", { query: query, parameters: parameters }, signUserCallback);
    }
    
    // sign user in the application
    function signUserCallback(error, user) {
        if (error) { throw error; }
        else if (user.length == 0) {
            // No user found
            response.json({ token: null, user: null, error: "No user found" });
        } else if (user != null && user.length != 0) {
            // We are sending the profile inside the token
            communication.sign(user, getToken);
        }
    }
    
    // get token to send back to the client
    function getToken(error, token) {
        if (error) { throw error }
        else response.json({ token: token, user: user });
    }
});

// start server
server.listen(9000, function () {
    console.log('server listening on http://localhost:9000');
});