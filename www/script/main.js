$(document).ready(main);

function main() {
    $("#addMarker").click(addMarker);
    myMap(parseFloat(47.010921), parseFloat(28.840330));
    setOutput();
}

var geocoder;
var markers = [];
var map;

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
        if(markers.size < 2){
            markers.setMap(null);
        }
        markers = new google.maps.Marker({position: e.latLng});
        markers.setMap(map);
        $("#latitude").val(markers.getPosition().lat());
        $("#longitude").val(markers.getPosition().lng());
        geocodePosition(markers.getPosition())
    });

}

function geocodePosition(pos){
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0){
            markers.formatted_address = responses[0].formatted_address;
        }
        $("#address").val(markers.formatted_address);
        $("#longLat").val(markers.getPosition().lat() + ":" + markers.getPosition().lng());
    })
}


function addMarker() {
    var address = $('#address').val(),
        coordinates = $('#longLat').val().trim().split(':');
    myMap(coordinates[0], coordinates[1]);
    setInput(address, coordinates);
}


function setInput(address, coordinates) {
    $.ajax({
        url: "http://localhost:8080/coordinates",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: '{ "coordinateStart":' + '"' + address + '"' + ', "coordinateEnd":' + '"' + coordinates + '"' + '}',
        processData: false,
        success: function () {
            console.log("Coordinates sent to API \n" + address + "  " + coordinates);
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
                $('#output').append('<dt id="coords">' + value.coordinateStart + " : " + value.coordinateEnd);
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
        var coordinates = click_text[1].trim().split(',');
        myMap(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
    });
}



