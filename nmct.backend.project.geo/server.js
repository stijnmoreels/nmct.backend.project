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
var communication = require('./socket/communication.js');
communication.listen(server);

// login (can see map but can't add shares)
// because the socket communication is authorized
// the first communication between client - server
// has to come from ajax calls so the client can sign 
// the socket communication with his/hers token
app.post('/login', function (request, response) {
    var Request = require("./http/request.js"),
        repository = require("./repository/generic.js"),
        loggedInUser = {};
    request.on('data', function (data) {
        Request.parseRequest(data, parseRequestCallback);
    });
    
    // get the data from the POST and find the right user
    function parseRequestCallback(error, data) {
        if (error) { throw error; }
        repository.getOne(data, "users", signUserCallback);
    }
    
    // sign user in the application
    function signUserCallback(error, user) {
        if (error) { throw error; }
        else if (user.length === 0) {
            // No user found
            response.json({ token: null, user: null, error: "No user found" });
        } else if (user !== null && user.length !== 0) {
            // We are sending the profile inside the token
            loggedInUser = user;
            communication.sign(user, getToken);
        }
    }
    
    // get token to send back to the client
    function getToken(error, token) {
        if (error) { throw error; }
        else response.json({ token: token, user: loggedInUser[0] });
    }
});

// start server
server.listen(9000, function () {
    console.log('server listening on http://localhost:9000');
});