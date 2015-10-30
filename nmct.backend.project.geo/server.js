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

var communication = require('./socket/communication.js');
communication.listen(server);

server.listen(9000, function () {
    console.log('listening on http://localhost:9000');
});