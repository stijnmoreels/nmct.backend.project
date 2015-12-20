/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Unit Tests for the Geofeelings Project 
 *           (tests the DocumentDb connection)
 =============================================================================*/

"use-strict";
describe("Unit: DocumentDb testing", function () {
    var assert = require('assert'),
        documentDb = require('../../database/documentdb.js');
    
    //// Insert an test activity
    before("Should insert an activity with id='unit-test-activity'", function () {
        var activity = { id: "unit-test-activity", activityName: "unit-test-activity", isActivity: true };
        documentDb.insert("shares", activity, insertDocumentCallback);
        function insertDocumentCallback(error, document) {
            if (error) { throw error; }
            assert.notEqual(document, null);
        }
    });

    // Get all activities in the database
    it("Should return a list of activities", function (done) {
        var query = { query: "SELECT * FROM shares s WHERE s.isActivity=true" };
        // to reduce costs, activities are saved in the same document collection as the shares
        documentDb.query("shares", query, queryDocumentsCallback);
        function queryDocumentsCallback(error, documents) {
            if(error) { throw error; }
            assert.notEqual(documents, null);
            assert.equal(documents.length > 0, true);
            done();
        }
    });
    
    // Get all unsigned shares (not signed to an activity)
    it("Should return a list of unsigned shares", function (done) {
        // Unsigned shares have an 'activityID' equals to '0'
        var query = { query: "SELECT * FROM shares s WHERE s.isActivity=false AND s.activityId=0" };
        documentDb.query("shares", query, queryDocumentsCallback);
        function queryDocumentsCallback(error, documents) {
            if(error) { throw error; }
            assert.notEqual(documents, null);
            assert.equal(documents.length > 0, true);
            done();
        }
    });

    // Delete the test activity
    after("Should delete an activity with id='unit-test-activity'", function () {
        documentDb.deleteDocument("shares", "unit-test-activity", deleteDocumentCallback);
        function deleteDocumentCallback(error) {
            if (error) { throw error; }
            assert.equal(error, undefined); // no error = successfully deleted (see Documentation)
        }
    });
});