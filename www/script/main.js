// need to output coordinates Too in address tag
$(document).ready(main);
var map;
var markers = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var $token, $userID;


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
    $("#startLngLat").val(null);
    $("#endLngLat").val(null);
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 47.00989485019684, lng: 28.840969763696194}
    });
    directionsDisplay.setMap(map);

    map.addListener('click', function (e) {
        addMarker(e.latLng, map);
    });
}

function addMarker(latLng, map) {
    if (markers.length > 1) {
        alert("clear !");
        clearMarkers();
        setEmptyFields();
    }
    markers.push(new google.maps.Marker({
        position: latLng,
        map: map
    }));
    geocodePosition(markers.length - 1);
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
            $("#startLngLat").val(markers[i].getPosition().lng() + ":" + markers[i].getPosition().lat());
        }
        if (i === 1) {
            $("#endAddress").val(markers[i].formatted_address);
            $("#endLngLat").val(markers[i].getPosition().lng() + ":" + markers[i].getPosition().lat());
        }
    })
}

// Show Route
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var start = $("#startLngLat").val().split(":"),
        end = $("#endLngLat").val().split(":");
    directionsService.route({
        // origin: $("#startAddress").val(),
        // destination: $("#endAddress").val(),
        origin: new google.maps.LatLng(parseFloat(start[1]), parseFloat(start[0])),
        destination: new google.maps.LatLng(parseFloat(end[1]), parseFloat(end[0])),
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === "OK") {
            console.log('success');
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
        startCoordinates = $("#startLngLat").val().trim(),
        endCoordinates = $("#endLngLat").val().trim(),
        time = new Date(),
        startTime = time.getTime(),
        endTime = startTime + parseInt($("#requestLifeTime").val().split(" ")[0]) * 1000 * 60;
    $.ajax({
        url: "http://localhost:8080/users/" + $userID + "/coordinates",
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $token);
        },
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
        '"lifeTime":' + '"' + ($("#requestLifeTime").val().split(" ")[0]) + '", ' +
        '"routeDistance":' + '"' + ($("#routeDistance").val().split(" ")[0]) + '"' +
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
        url: "http://localhost:8080/users/" + $userID +  "/coordinates",
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $token);
        },
        dataType: 'json',
        success: function (data) {
            allDirectionsContainer = null;
            $("#output").html(null);
            $.each(data, function (index, value) {
                allDirectionsContainer = data;
                $("#output")
                    .append('<dt class="addresses">' + value.coordinateStart + " - " + value.coordinateEnd + " - "
                        + value.addressStart + " - " + value.addressEnd + " - [LifeTime : " + value.lifeTime
                        + " minutes] [ " + value.id + " ]" + "</dt>");
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
    $('#startLngLat').val(click_text[0]);
    $('#endLngLat').val(click_text[1]);
    $("#startAddress").val(click_text[2]);
    $("#endAddress").val(click_text[3]);
    $('#selected').html('<b>Selected: </b>' + click_text[2] + " : " + click_text[3]);
    calculateAndDisplayRoute(directionsService, directionsDisplay)
});

$('#output').on('contextmenu', 'dt', function () {
    var click_text = $(this).text().split(' - ');
    $.each(allDirectionsContainer, function (index, value) {
        if (click_text[0] === value.coordinateStart && click_text[1] === value.coordinateEnd) {
            deleteDirection(value.id);
        }

    })
});


function deleteDirection(id) {

    $.ajax({
        url: "http://localhost:8080/users/" + $userID + "/coordinates/" + id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", $token);
        },
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
    // var time = new Date(),
    //     start = time.getTime(),
    //     end = start+parseInt($(this).text().split(" ")[0])*1000*60;
    // console.log("start = "+start+" | end = "+end);
    $("#requestLifeTime").val($(this).text());
});


$("#showAvailableRoute").click(function () {
    var time = new Date();
    $.ajax({
        url: 'http://localhost:8080/users/' + $userID + '/availableRoute',
        type: 'GET',
        authorization: $token,
        dataType: 'json',
        success: function (data) {
            $("#availableRoute").html(null);
            $.each(data, function (index, value) {
                $("#availableRoute")
                    .append('<dt class="addresses">' + value.addressStart +
                        " - " + value.addressEnd + " - [LifeTime : " + value.lifeTime +
                        " minutes]" + "[RemainingTime : " +
                        ((parseFloat(value.endTime) - parseFloat(time.getTime())) / (1000 * 60)).toFixed(2) + " ]" + "[ " + value.id + " ]");
            });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#availableRoute").html("Something is wrong with get request ... check it one more time please !");
        }
    });
});


$("#toggleButtons>div").eq(0).click(function () {
    $("#selected").fadeToggle();
});

$("#toggleButtons>div").eq(1).click(function () {
    $("#output").fadeToggle();
});

$("#toggleButtons>div").eq(2).click(function () {
    $("#availableRoute").fadeToggle();
});

$("#calculateDist").click(function () {
    var lat1 = parseFloat($("#startLngLat").val().split(":")[1]),
        lng1 = parseFloat($("#startLngLat").val().split(":")[0]),
        lat2 = parseFloat($("#endLngLat").val().split(":")[1]),
        lng2 = parseFloat($("#endLngLat").val().split(":")[0]),
        R = 6371000, // Radius of the earth in m
        dLat = deg2rad(lat2 - lat1),  //transform in rad
        dLon = deg2rad(lng2 - lng1),
        a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
        distance = (R * c).toFixed(1); // Distance in m
    $("#routeDistance").val(distance + " meters");
});


function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

$("#login").click(function () {
    var user = $("#username").val().trim();

    var pass = $("#password").val().trim();

    console.log(user);
    console.log(pass);

    $.ajax({
        url: "http://localhost:8080/login",
        type: 'POST',
        contentType: 'application/json',
        data: '{"username" : "' + user + '", "password" : "' + pass + '"}',
        success: function (data, textStatus, xhr) {
            alert("Logged in!");
            console.log(xhr.getResponseHeader('authorization'));
            console.log(xhr.getResponseHeader('UserID'));
            $token = xhr.getResponseHeader('authorization');
            $userID = xhr.getResponseHeader('UserID');
            $("#beforeLogin").hide();
            $("#afterLogin").show();
            $("#usernameWelcome").html("You are logged in as " + user + "!")
            setOutput();
        }, error: function (textStatus, xhr) {
            alert("Not logged in!");
            console.log(textStatus);
        }
    })
});

$("#logout").click(function () {
    $("#username").val(null);
    $("#password").val(null);
    alert("Logged out!");
    $token = null;
    $userID = null;
    $("#afterLogin").hide();
    $("#beforeLogin").show();
});



$("#register").click(function () {
    var user = $("#username").val().trim();
    var pass = $("#password").val().trim();

    console.log(user);
    console.log(pass);

    $.ajax({
        url: "http://localhost:8080/users/sign-up",
        type: 'POST',
        contentType: 'application/json',
        data: '{"username" : "' + user + '", "password" : "' + pass + '"}',
        success: function (data, textStatus, xhr) {
            alert("Successfully registered! Please use the username: " + user
                + " and a valid password in order to continue!");

        }, error: function (textStatus, xhr) {
            alert("Not logged in!");
            console.log(textStatus);
        }
    })
});

