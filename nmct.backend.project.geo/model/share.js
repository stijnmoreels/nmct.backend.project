/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Share Model 
 =============================================================================*/
var Share = function (id, feeling, latitude, longitude, activityId) {
    this.id = id;
    this.feeling = feeling;
    this.latitude = latitude;
    this.longitude = longitude;
    this.activityId = activityId;
}
Share.prototype = {
    initialize: function (id, feeling, latitude, longitude, activityId) {
        this.id = id;
        this.feeling = feeling;
        this.latitude = tatitude;
        this.longitude = longitude;
        this.activityId = activityId;
    }
};
module.exports = Share;