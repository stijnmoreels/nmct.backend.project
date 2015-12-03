(function () {
    "use strict";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showError(error);
    }
})();

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latlng = {lat: lat, lng: lng};
    placeMarkerAndPanTo(latlng, map);
}

function placeMarkerAndPanTo(latlng, map) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        draggable: true
    });
    map.panTo(latlng);

    var contentString =
        '<div id="iw-container" class="container">' +
            '<div class="row">' +
            '<h1 class="iw-title">Add your feeling</h1>'+
                '<div class="col-sm-5">' +
                    '<div class="list-group">' +
                        '<button id="feeling_id" value="happy" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/happy@xs.png" alt="happy">'+
                            '<span class="feeling-text">Happy </span>'+
                            ' <span class="badge share-count">12</span>'+
                        '</button>'+
                        '<button value="excited" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/excited@xs.png" alt="excited">'+
                            '<span class="feeling-text">Excited</span>'+
                            ' <span class="badge share-count">12</span>'+
                        '</button>'+
                        '<button value="tender" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/tender@xs.png" alt="tender">'+
                            '<span class="feeling-text">Tender</span>'+
                            '<span class="badge share-count">12</span>'+
                        '</button>'+
                    '</div>'+
                '</div>'+
                '<div class="col-sm-5">' +
                    '<div class="list-group feelings-right">' +
                        '<button value="scared" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/scared@xs.png" alt="scared">'+
                            '<span class="feeling-text">Scared</span>'+
                            '<span class="badge share-count">12</span>'+
                        '</button>'+
                        '<button value="sad" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/sad@xs.png" alt="sad">'+
                            '<span class="feeling-text">Sad</span>'+
                            '<span class="badge share-count">12</span>'+
                        '</button>'+
                        '<button value="angry" class="list-group-item feeling-btn">'+
                            '<img class="feeling-icon" src="./images/angry@xs.png" alt="angry">'+
                            '<span class="feeling-text">Angry</span>'+
                            '<span class="badge share-count">12</span>'+
                        '</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';



    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });


    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(infowindow, 'domready', function () {
       document.getElementById("feeling_id").addEventListener("click", function (e) {
           var feeling = document.getElementById("feeling_id").value;
           console.log(feeling);
           var btnfeeling = document.getElementById("feeling_id").setAttribute("class", "chosen-feeling list-group-item feeling-btn");
       })
    });
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showErrorMsg();
            break;
        case error.POSITION_UNAVAILABLE:
            showErrorMsg();
            break;
        case error.TIMEOUT:
            showErrorMsg();
            break;
        case error.UNKNOWN_ERROR:
            showErrorMsg();
            break;
    }
}
