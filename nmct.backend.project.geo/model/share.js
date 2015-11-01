/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Share Model 
 * @comments: id = timestamp + author
 =============================================================================*/
var Share = function (id, feeling, author, latitude, longitude, activityId, timestamp) {
    this.id = id;
    this.author = author;
    this.feeling = feeling;
    this.latitude = latitude;
    this.longitude = longitude;
    this.activityId = activityId;
    this.timestamp = timestamp;
}
Share.prototype = {
    initialize: function (id, feeling, author, latitude, longitude, activityId, timestamp) {
        this.id = id;
        this.author = author;
        this.feeling = feeling;
        this.latitude = tatitude;
        this.longitude = longitude;
        this.activityId = activityId;
        this.timestamp = timestamp;
    }
};
module.exports = Share;