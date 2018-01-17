function initMap() {
  //position
  var position = new google.maps.LatLng(47.015, 28.845);

  //new map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: position
  });

 //marker - first position
/* var marker = new google.maps.Marker({
    position: position,
    map: map,
  })*/
 var marker;
 
  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker(position, map) {
      var marker = new google.maps.Marker({
      position: position,
      map: map
    });  
  }
}

google.maps.event.addDomListener(window, 'load', initMap);

