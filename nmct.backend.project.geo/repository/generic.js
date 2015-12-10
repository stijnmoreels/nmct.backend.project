/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Generic Repository
 =============================================================================*/

var Generic = (function () {
    var documentDb = require("../database/documentdb.js");

    getAll = function (collection, callback) {
        if (collection === "shares") getShares(callback);
        else if (collection === "activities") getActivities(callback);
    }, getShares = function (callback) {
        var query = { query: "SELECT * FROM shares s WHERE s.isActivity=false" };
        documentDB.query("shares", query, callback);
    }, getActivities = function (callback) { 
        var query = { query: "SELECT * FROM shares s WHERE s.isActivity=true" };
        DocumentDB.query("shares", query, callback);
    };

    return {
        getAll: getAll
    };
})();

module.exports = Generic;