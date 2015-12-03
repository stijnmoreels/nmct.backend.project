/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Tests for the Geofeelings Project 
 *           (tests the socket connection and authorization)
 =============================================================================*/

"use-strict";
describe("Socket tests", function () {
    var assert = require("assert"),
        querystring = require('querystring'),
        http = require('http'),
        io = require('socket.io-client'),
        testToken = "",
        socket;
    
    // Get token from server and set it as global "testToken"
    // The only ajax relation with the server is when the user gets its token
    it("Should return a user token", function (done) {
        var body = "";
        var request = http.request({
            method: "POST", headers: { "Content-Type": "text/html; charset=UTF-8" }, hostname: "localhost", port: 9000, path: "/login"
        }, function (response) {
            response.on("data", function (data) {
                body += data;
            });
            response.on("end", function () {
                // parse token from body
                var data = querystring.parse(body);
                var token = JSON.parse(Object.keys(data)[0]).token;
                assert.notEqual(token, null);
                if (token) {
                    testToken = token;
                    // setup socket connection with the just received token
                    socket = io.connect('http://localhost:9000', {
                        'forceNew': true,
                        'query': "token=" + token
                    });
                    done();
                }
            });
        });
        // anonymous credentials (hashed password)
        request.write(querystring.stringify({
            username: "anonymous",
            password: "40bd001563085fc35165329ea1ff5c5ecbdbbeef"
        }));
    });
    
    
    
    // Get all shares in the database
    it("Should get all shares", function (done) {
        socket.on("shares", function (shares) {
            assert.notEqual(shares, null);
            assert.equal(shares.length > 0, true);
            done();
        });
        socket.emit("shares", null);
    });
    
    // Try to add a share when logged in as anonymous
    it("Should not insert a share (logged in as anonymous)", function (done) {
        socket.on("addshare", function (created) {
            // will never be fired
            console.log(created);
            done();
        }).on("unauthorized", function (error) {
            // if error => passed
            assert.notEqual(error, null);
            done();
        });
        
        // dummy share with happy feeling
        var share = { id: "0", feeling: "happy" };
        var object = { error: null, share: share, token: testToken };
        socket.emit("addshare", object);
    });
});