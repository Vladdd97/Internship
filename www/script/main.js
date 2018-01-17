$(document).ready(main);

function main() {
    $("#addMarker").click(addMarker);
}

function myMap(long,lat) {
    var myCenter = new google.maps.LatLng(long,lat);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {center: myCenter, zoom: 5};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
}

function addMarker() {
    var long = parseFloat( $("#longitude").val() ),
        lat = parseFloat( $("#latitude").val() );
    alert(long+"  "+lat);
    myMap(long,lat);
    setOutput(long,lat)

}

function setOutput(long,lat) {
    $("#output").html("You have entered : long = " + long + " and lat = " + lat);
}