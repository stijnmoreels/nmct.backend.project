/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Communication with the hosted DocumenteDB (Azure)
 =============================================================================*/

var DocumentDB = (function () {
    var config = require("../config/configuration");
    var DocumentClient = require('documentdb').DocumentClient;
    var client = new DocumentClient(config.host, { masterKey: config.masterKey });
    
    var queryDocuments = function (collection, query, callback) {
        client.queryDocuments(config.collectionId + collection, query).toArray(callback);
    }, insertDocument = function (collection, document, callback) {
        client.createDocument(config.collectionId + collection, document, callback);
    };
    
    return {
        query: queryDocuments,
        insert: insertDocument
    };
})();
module.exports = DocumentDB;

/* -----------------------------------------------------------------------------
 * Note: (query syntax): 
 * var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: document.id
        }]
    };
 * (document syntax): "model"-folder
 -----------------------------------------------------------------------------*/