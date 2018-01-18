$(document).ready(main);

function main() {
    $("#addMarker").click(addMarker);
    myMap(parseFloat(47.010921), parseFloat(28.840330));
    setOutput();
}

function myMap(long, lat) {
    var myCenter = new google.maps.LatLng(long, lat);
    var mapCanvas = document.getElementById("map");
    var mapOptions = {center: myCenter, zoom: 10};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position: myCenter});
    marker.setMap(map);

    google.maps.event.addListener(map, 'click', function(e) {
        marker.setMap(null);
        marker = new google.maps.Marker({position: e.latLng});
        marker.setMap(map);
    });

}

function addMarker() {
    var lat = parseFloat($("#latitude").val()),
        long = parseFloat($("#longitude").val());
        myMap(lat, long);
        setInput(lat, long);
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
            console.log("Input was successfully setted \n" + lat + "  " + long);
            console.log("\nInput : " + JSON.stringify(data));
            setOutput(lat, long);
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
            $.each(data, function (index, value) {
                $('#output').append('<dt id="coords">'  + value.coordinateStart + ":" + value.coordinateEnd);
            });
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#output").html("Something is wrong with get request ... check it one more time please !");
        }
    });

    $('#output').on('click', 'dt', function() {
        var click_text = $(this).text().split(':');
        $('#selected').html('Selected ' + click_text[0] + " : " + click_text[1]);
        myMap(click_text[0], click_text[1]);
    });


}



