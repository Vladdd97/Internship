// need to output coordinates Too in address tag

$(document).ready(main);
var map;
var markers = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
function main() {
    initMap();
    $("#showRoute").click(showRoute);
    $("#deleteRoute").click(deleteRoute);
}

function showRoute() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    setInput();
    clearMarkers();
}

function deleteRoute() {
    directionsDisplay.setDirections({routes: []});
    setEmptyFields();
}

function setEmptyFields() {
    $("#startAddress").val(null);
    $("#endAddress").val(null);
    $("#startLatLng").val(null);
    $("#endLatLng").val(null);
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 47.00989485019684, lng: 28.840969763696194 }
    });
    directionsDisplay.setMap(map);

    map.addListener('click', function(e) {
        addMarker(e.latLng, map);
    });
}

function addMarker(latLng, map) {
    if (markers.length > 1){
        alert("clear !");
        clearMarkers();
        setEmptyFields();
    }
    markers.push(new google.maps.Marker({
        position: latLng,
        map: map
    }));
    geocodePosition(markers.length-1);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//delete all markers
function clearMarkers() {
    setMapOnAll(null);
    markers = [];
}

// Fill our form with adress and coordinates
function geocodePosition(i) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        latLng: markers[i].getPosition()
    }, function (responses) {
        if (responses && responses.length > 0) {
            markers[i].formatted_address = responses[0].formatted_address;
        }
        if (i === 0) {
            $("#startAddress").val(markers[i].formatted_address);
            $("#startLatLng").val(markers[i].getPosition().lat() + ":" + markers[i].getPosition().lng());
        }
        if (i === 1) {
            $("#endAddress").val(markers[i].formatted_address);
            $("#endLatLng").val(markers[i].getPosition().lat() + ":" + markers[i].getPosition().lng());
        }
    })
}

// Show Route
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: $("#startAddress").val() ,
        destination: $("#endAddress").val() ,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === "OK") {
            // console.log('success');
            // console.log($('#startAddress').val());
            // console.log($('#endAddress').val());
            directionsDisplay.setDirections(response);

        } else {
            console.log('insuccess');
            console.log($('#startAddress').val());
            console.log($('#endAddress').val());
            window.alert('Directions request failed due to ' + status);
        }
    });
}


function setInput() {
    var startAddress = $("#startAddress").val(),
        endAddress = $('#endAddress').val(),
        startCoordinates = $("#startLatLng").val().trim(),
        endCoordinates = $("#endLatLng").val().trim(),
        time = new Date(),
        startTime = time.getTime(),
        endTime = startTime+parseInt($("#requestLiveTime").val().split(" ")[0])*1000*60;
    $.ajax({
        url: "http://localhost:8080/coordinates",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data:
        '{ ' +
        '"addressStart":' + '"' + startAddress + '", ' +
        '"coordinateStart":' + '"' + startCoordinates + '", ' +
        '"addressEnd":' + '"' + endAddress + '", ' +
        '"coordinateEnd":' + '"' + endCoordinates + '", ' +
        '"startTime":' + '"' + startTime + '", ' +
        '"endTime":' + '"' + endTime + '", ' +
        '"lifeTime":' + '"' + ($("#requestLiveTime").val().split(" ")[0]) + '"' +
        '}',
        processData: false,
        success: function () {
            $('#selected').html('Successfully added: ' + startAddress + " - " + endAddress);
            setOutput();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(startAddress);
            console.log(startCoordinates);
            console.log(endAddress);
            console.log(endCoordinates);
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
            allDirectionsContainer = null;
            $("#output").html(null);
            $.each(data, function (index, value) {
                allDirectionsContainer = data;
                $("#output")
                    .append('<dt class="addresses">' + value.addressStart + " - " + value.addressEnd + " - [LifeTime : "+value.lifeTime+" minutes] [ "+value.id+" ]");
            });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with get request ... check it one more time please !");
        }
    });

}

$('#output').on('click', 'dt', function () {
    var click_text = $(this).text().split(" - ");
    $('#startAddress').val(click_text[0]);
    $('#endAddress').val(click_text[1]);
    $('#selected').html('<b>Selected: </b>' + click_text[0] + " : " + click_text[1]);
     calculateAndDisplayRoute(directionsService, directionsDisplay)
});

$('#output').on('contextmenu', 'dt', function () {
    var click_text = $(this).text().split(' - ');
    $.each(allDirectionsContainer, function (index, value) {
        if (click_text[0] === value.addressStart && click_text[1] === value.addressEnd) {
            deleteDirection(value.id);
        }

    })
});


function deleteDirection(id) {

    $.ajax({
        url: "http://localhost:8080/coordinates/" + id,
        type: 'DELETE',
        success: function () {
            setOutput();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });

}

// All functions bellow ... Need Improvement !!!

$("details>p").click(function () {
    var time = new Date(),
        start = time.getTime(),
        end = start+parseInt($(this).text().split(" ")[0])*1000*60;
    console.log("start = "+start+" | end = "+end);
    $("#requestLiveTime").val($(this).text());
});


$("#showAvailableRoute").click(function () {
    var time = new Date();
    $.ajax({
        url: "http://localhost:8080/availableRoute",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#availableRoute").html(null);
            $.each(data, function (index, value) {
                $("#availableRoute")
                    .append('<dt class="addresses">' + value.addressStart +
                        " - " + value.addressEnd + " - [LifeTime : "+value.lifeTime+
                        " minutes]"+"[RemainingTime : "+
                        ((parseFloat(value.endTime)-parseFloat(time.getTime()))/(1000*60)).toFixed(1)+" ]"+"[ "+value.id+" ]");
            });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#availableRoute").html("Something is wrong with get request ... check it one more time please !");
        }
    });
});