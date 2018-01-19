$(document).ready(main);
var geocoder;
var markers = [] ;
var marker;
var map;
var directionsService;
var directionsDisplay;

function main() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    myMap(parseFloat(47.010921), parseFloat(28.840330));
    setOutput();

}


function myMap(long, lat) {
    geocoder = new google.maps.Geocoder();
    var myCenter = new google.maps.LatLng(long, lat);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: myCenter,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    directionsDisplay.setMap(map);
    marker = new google.maps.Marker({
        position: myCenter,
        draggable:true
    });
    markers.push(marker);
    clearMapMarkers();

    google.maps.event.addListener(map, 'click', function (e) {
        if (markers.length !== 3){
            marker = new google.maps.Marker({
                position: e.latLng,
                draggable: true
            });
            markers.push(marker);
            console.log('Array length ' + markers.length);
            setMapOnAll(map);

            console.log($('#startAddress').val());
            console.log($('#endAddress').val());

            if($('#startAddress').val() !== '' && $('#endAddress').val() !== ''){
                console.log('GOT INTO DIRECTIONS IF');
                console.log($('#startAddress').val());
                console.log($('#endAddress').val());
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            }

        } else {
            setMapOnAll(null);
            $("#startAddress").val(null);
            $("#endAddress").val(null);
            $("#startLongLat").val(null);
            $("#endLongLat").val(null);
            markers = [];
        }
    });
}

$("#addMarker").click(addMarker);

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        if(map != null){
            geocodePosition( i);
        }
    }
}
function clearMapMarkers() {
    setMapOnAll(null);
    markers = [];
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: $('#startAddress').val(),
        destination: $('#endAddress').val(),
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            console.log('success');
            console.log($('#startAddress').val());
            console.log($('#endAddress').val());
            directionsDisplay.setDirections(response);
            setMapOnAll(null);

        } else {
            console.log('insuccess');
            console.log($('#startAddress').val());
            console.log($('#endAddress').val());
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function geocodePosition(i){
    geocoder.geocode({
            latLng: markers[i].getPosition()
        }, function (responses) {
            if (responses && responses.length > 0){
                markers[i].formatted_address = responses[0].formatted_address;
            }
            if( i === 0){
                $("#startAddress").val(markers[i].formatted_address);
                $("#startLongLat").val(markers[i].getPosition().lat() + ":" + markers[i].getPosition().lng());
            }
            if(i === 1){
                $("#endAddress").val(markers[i].formatted_address);
                $("#endLongLat").val(markers[i].getPosition().lat() + ":" + markers[i].getPosition().lng());
            }
        })
}



function addMarker() {
    var startAddress = $('#startAddress').val(),
        startCoordinates = $('#startLongLat').val().trim().split(':'),
        endAddress = $('#endAddress').val(),
        endCoordinates = $('#endLongLat').val().trim().split(':');
    setInput(startAddress, startCoordinates, endAddress, endCoordinates);

}


function setInput(startAddress, startCoordinates, endAddress, endCoordinates) {
    $.ajax({
        url: "http://localhost:8080/coordinates",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data:
        '{ "addressStart":' + '"' + startAddress + '"' + ', "coordinateStart":' + '"' + startCoordinates + '"' +
        '"addressEnd":' + '"' + endAddress + '"' + ', "coordinateEnd":' + '"' + endCoordinates + '"' + '}',
        processData: false,
        success: function () {
            $('#selected').html('Successfully added: ' + startAddress + " " + endAddress);
            setOutput();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with post request ... check it one more time please !");
        }
    });
}

function setOutput() {
    $.ajax({
        url: "http://localhost:8080/coordinates",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#output").html(null);
            $.each(data, function (index, value) {
                $('#output')
                    .append('<dt id="coords">' + value.coordinateStart + " : " + value.coordinateEnd)
                    .append('<span id="addressNames">' + value.addressStart + " - " + value.addressEnd + '</span>');

            });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with get request ... check it one more time please !");
        }
    });

    $('#output').on('click', 'dt', function () {
        var click_text = $(this).text().split(' : ');
        $('#selected').html('<b>Selected: </b>' + click_text[0] + " : " + click_text[1]);
        myMap(parseFloat(click_text[0]), parseFloat(click_text[1]));
    });

}





