/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Share Model 
 =============================================================================*/
var Share = function () {
    this.id = 0;
    this.feeling = "";
    this.latitude = 0.0;
    this.longitude = 0.0;
    this.activityId = 0;
}

Share.prototype = {
    initialize: function (id, feeling, latitude, longitude, activityId) {
        this.id = id;
        this.latitude = tatitude;
        this.longitude = longitude;
        this.activityId = activityId;
    }
};

module.exports = Share;