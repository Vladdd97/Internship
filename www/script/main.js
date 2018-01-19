$(document).ready(main);
var geocoder;
var markers = [] ;
var map;

function main() {
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
    markers = new google.maps.Marker({position: myCenter});
    markers.setMap(map);

    google.maps.event.addListener(map, 'click', function (e) {
        markers.setMap(null);
        markers = new google.maps.Marker({position: e.latLng});
        markers.setMap(map);
        geocodePosition(markers.getPosition())
    });

}
$("#addMarker").click(addMarker);

function geocodePosition(pos){
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0){
            markers.formatted_address = responses[0].formatted_address;
        }
        $("#startAddress").val(markers.formatted_address);
        $("#startLongLat").val(markers.getPosition().lat() + ":" + markers.getPosition().lng());
    })
}


function addMarker() {
    var startAddress = $('#startAddress').val(),
        startCoordinates = $('#startLongLat').val().trim().split(':'),
        endAddress = $('#endAddress').val(),
        endCoordinates = $('#endLongLat').val().trim().split(':');
    myMap(startCoordinates[0], startCoordinates[1]);
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
            console.log("Start sent to API \n" + startAddress + "  " + startCoordinates);
            console.log("End sent to API \n" + endAddress + "  " + endCoordinates);
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




