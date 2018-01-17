$(document).ready(main);

function main() {
    $("#addMarker").click(addMarker);
}

function myMap(long, lat) {
    var myCenter = new google.maps.LatLng(long, lat);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {center: myCenter, zoom: 5};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position: myCenter});
    marker.setMap(map);
}

function addMarker() {
    var lat = parseFloat($("#latitude").val()),
        long = parseFloat($("#longitude").val());
    myMap(lat, long);
    setInput(lat, long);
    //setOutput(long,lat);


}

function setInput(lat, long) {
    $.ajax({
        url: "http://localhost:8080/coordinates",
        dataType: 'json',
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: '{ "coordinateStart":' + lat + ', "coordinateEnd":' + long + '}',
        processData: false,
        success: function (data) {
            alert("Input was successfully setted \n" + lat + "  " + long);
            console.log("\nInput : " + JSON.stringify(data));
            setOutput(lat, long);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with post request ... check it one more time please !");
        }
    });
}

function setOutput(lat, long) {
    $.ajax({
        url: "http://localhost:8080/coordinates",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("\nOutput(all database fields) : " + JSON.stringify(data));
            $("#output").html("You have entered : lat = " + lat + " and long = " + long);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with get request ... check it one more time please !");
        }
    });


}