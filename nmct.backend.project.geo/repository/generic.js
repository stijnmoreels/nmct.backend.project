/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Generic Repository
 =============================================================================*/

var Generic = (function () {
    var documentDb = require("../database/documentdb.js");
    var sharesDefaultQuery = "SELECT * FROM shares s WHERE s.isActivity=false";
    var activitiesDefaultQuery = "SELECT * FROM shares s WHERE s.isActivity=false";
    
    // Abstract: Act as a generic method that handles all the query lists of the database collection
    getAll = function (collection, callback) {
        switch (collection) {
            case "shares": getShares(null, callback);
            case "signedshares": getSignedShares(sharesDefaultQuery + " AND s.activityId!=0", callback);
            case "unsignedshares": getUnsignedShares(activitiesDefaultQuery + " AND s.activityId=0" , callback);
            case "activities": getActivities(callback);
            default: callback("No such collection found", null);
        }
    }, 
    // Concrete: Get all shares from databse
    getShares = function (query, callback) {
        var query = { query: query !== null ? query : sharesDefaultQuery };
        documentDb.query("shares", query, callback);
    }, 
    // Concrete: Get all activities from database
    getActivities = function (callback) {
        var query = { query: activitiesDefaultQuery };
        documentDb.query("shares", query, callback);
    },
    // Abstract: Act as a generic method that handles the where query of the database collection
    getOne = function (wheres, collection, callback) {
        switch (collection) {
            case "users": getOneUser(wheres, callback);
            case "shares": getOneShare(wheres, callback);
            default: callback("No such WHERE implementation found", null);
        }
    },
    // Concrete: Get one user from collection
    getOneUser = function (wheres, callback) {
        if (wheres.username === undefined || wheres.password === undefined) { callback("No valid statement found", null); }
        var query = "SELECT * FROM users u WHERE u.username=@username AND u.password=@password";
        var parameters = [{ name: "@username", value: wheres.username + "" }, { name: "@password", value: wheres.password + "" }];
        documentDb.query("users", { query: query, parameters: parameters }, callback);
    },
    // Concrete: Get one share from collection
    getOneShare = function (wheres, callback) {
        if (wheres.username === undefined || wheres.activityId === undefined) { callback("No valid statement found", null); }
        var query = sharesDefaultQuery + "  AND s.author=@username AND s.activityId=@activityId";
        var parameters = [{ name: "@username", value: wheres.username }, { name: "@activityId", value: wheres.activityId }];
        documentDb.query("shares", { query: query, parameters: parameters }, callback);
    },
    // Abstract: Act as a generic insert function for whatever collection
    insertOne = function (item, collection, callback) {
        if (item === null || item.id === null) { callback("Invalid item found", null); }
        if (collection === null) { callback("Invalid collection found", null); }
        documentDb.insert(collection, item, callback);
    }, 
    // Abstract: Act as a generic delete function that deletes one item
    deleteOne = function (itemId, collection, callback) {
        documentDb.deleteDocument(collection, itemId, callback);
    };
    
    // Public methods
    return {
        getAll: getAll,
        getOne: getOne,
        insertOne: insertOne,
        deleteOne: deleteOne
    };
})();

module.exports = Generic;