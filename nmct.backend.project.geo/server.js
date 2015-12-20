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

// routes
var authenticationRoute = require('./routes/authentication.js')(app);

// start server
server.listen(9000, function () {
    console.log('server listening on http://localhost:' + 9000);
});