/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Communication with the hosted DocumenteDB (Azure)
 =============================================================================*/

var DocumentDB = (function () {
    "use-strict";
    var config = require("../config/configuration");
    var DocumentClient = require('documentdb').DocumentClient;
    var client = new DocumentClient(config.host, { masterKey: config.masterKey });
    
    // query documents from DocumentDB (from collection Id)
    var queryDocuments = function (collection, query, callback) {
        client.queryDocuments(config.collectionId + collection, query).toArray(callback);
    }, 
        // insert document in DocumentDB (from collection Id)
        insertDocument = function (collection, document, callback) {
            client.createDocument(config.collectionId + collection, document, callback);
        },
        // delete document in DocumentDB (from document Id)
        deleteDocument = function (collection, documentId, callback) {
            client.deleteDocument(config.collectionId + collection + "/docs/" + documentId, callback);
        };
    
    // public methods
    return {
        query: queryDocuments,
        insert: insertDocument,
        deleteDocument: deleteDocument
    };
})();

module.exports = DocumentDB;

/* -------------------------------------------------------------------------------------------------
 * Note: (query syntax): 
 * { query: 'SELECT * FROM root r WHERE r.id=@id', parameters: [{ name: '@id', value: document.}] };
 --------------------------------------------------------------------------------------------------*/