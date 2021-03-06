﻿/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Server Side 
 =============================================================================*/

var express = require('express');
var http = require('http');
var Request = require("./request.js");

var socketIo = require('socket.io');
var socketio_jwt = require('socketio-jwt');

var jwt = require('jsonwebtoken');
var jwt_secret = 'BRZ8gRtRzmNMcEzSfA6wq8zC3ACZGvuFKGHGaNw78DvTtX8azxRCfyWAEZUvwUKkP6sNFZxL5trJSLZ4FKt5Dyc46bRMzt4Z2UjsT4zUKseaN6hAgxQHaTzn';

var app = express();

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

app.use(serveStatic('public/src', { 'index': ['index.html'] }));
app.use(bodyParser.json());

var server = http.createServer(app);
var sio = socketIo.listen(server);

sio.use(socketio_jwt.authorize({
    secret: jwt_secret,
    handshake: true
}));

sio.sockets
  .on('connection', function (socket) {
    console.log(socket.decoded_token.email, 'connected');
    
    socket.on("addshare", function (error, share) {
        sio.emit("addshare", share);
    });

    // BROADCAST
    //sio.emit('this', { will: 'be received by everyone' });
    
    // PRIVATE
    //socket.on('private message', function (from, msg) {
    //    console.log('I received a private message by ', from, ' saying ', msg);
    //});
    
    // DISCONNECT
    //socket.on('disconnect', function () {
    //    io.emit('user disconnected');
    //});
});


// LOGIN
// -----------------------------------------------------------------------------
app.post('/login', function (request, response) {
    var user = {};
    request.on('data', function (data) {
        Request.parseRequest(data, parseRequestCallback);
        // We are sending the profile inside the token
        var token = jwt.sign(user, jwt_secret, { expiresInMinutes: 60 * 5 });
        response.json({ token: token });
    });

    function parseRequestCallback(error, data) {
        if (error) { throw error }
        
        // TODO: get user from NoSQL
        user = data;
        user.id = 123;
        user.email = "john@doe.com";
    }
});
// -----------------------------------------------------------------------------


// ADD SHARE
// -----------------------------------------------------------------------------
app.post('/add-share', function (request, response) {
    var object = {};
    request.on('data', function (data) {
        Request.parseRequest(data, parseObjectRequestCallback);
        var decoded = jwt.verify(object.token, jwt_secret, verifyTokenCallback);
        // TODO: add share
    });

    function parseObjectRequestCallback(error, data) {
        if (error) { throw error }
        object = data;
    }

    function verifyTokenCallback(error, decoded) {
        if (error) { throw error }
        var user = decoded;

    // TODO: add share
    }
});
// -----------------------------------------------------------------------------


server.listen(9000, function () {
    console.log('listening on http://localhost:9000');
});