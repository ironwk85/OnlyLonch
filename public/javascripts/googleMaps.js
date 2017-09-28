// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map;
//google.maps.event.addDomListener(window, 'load', initMap);

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644}, zoom: 12
    });
    var polancoCoords = [
        {lat: 19.456355, lng: -99.2200184},
        {lat: 19.4542508, lng: -99.2198896},
        {lat: 19.4487879, lng: -99.2201042},
        {lat: 19.4464004, lng: -99.22019},
        {lat: 19.4454696, lng: -99.2199755},
        {lat: 19.4448221, lng: -99.2193317},
        {lat: 19.4443365, lng: -99.2183018},
        {lat: 19.44377, lng: -99.2173576},
        {lat: 19.4425559, lng: -99.2162848},
        {lat: 19.441261, lng: -99.2153835},
        {lat: 19.4386305, lng: -99.2140102},
        {lat: 19.437295, lng: -99.2134523},
        {lat: 19.4361619, lng: -99.2128515},
        {lat: 19.4354739, lng: -99.2122936},
        {lat: 19.4344621, lng: -99.2112207},
        {lat: 19.4338955, lng: -99.2104912},
        {lat: 19.4333694, lng: -99.2099333},
        {lat: 19.4328838, lng: -99.2088604},
        {lat: 19.4327017, lng: -99.2086673},
        {lat: 19.432469, lng: -99.2084956},
        {lat: 19.4319732, lng: -99.2082918},
        {lat: 19.4315179, lng: -99.2080128},
        {lat: 19.4306073, lng: -99.2065001},
        {lat: 19.4287153, lng: -99.2039573},
        {lat: 19.4279261, lng: -99.2030025},
        {lat: 19.4278451, lng: -99.2021871},
        {lat: 19.4273595, lng: -99.2014039},
        {lat: 19.4272684, lng: -99.2012429},
        {lat: 19.426722, lng: -99.1974878},
        {lat: 19.4254471, lng: -99.1892266},
        {lat: 19.4239699, lng: -99.1797853},
        {lat: 19.423636, lng: -99.1776395},
        {lat: 19.4263476, lng: -99.1758639},
        {lat: 19.4298485, lng: -99.1736376},
        {lat: 19.4323577, lng: -99.1723824},
        {lat: 19.4332885, lng: -99.174099},
        {lat: 19.4348263, lng: -99.1766739},
        {lat: 19.4370522, lng: -99.1814804},
        {lat: 19.4381044, lng: -99.1829824},
        {lat: 19.4388328, lng: -99.1849136},
        {lat: 19.4391161, lng: -99.1869307},
        {lat: 19.4392375, lng: -99.1883898},
        {lat: 19.4396422, lng: -99.1894627},
        {lat: 19.4401278, lng: -99.190321},
        {lat: 19.441787, lng: -99.1916513},
        {lat: 19.4424548, lng: -99.1921663},
        {lat: 19.4427886, lng: -99.192853},
        {lat: 19.4433147, lng: -99.1961575},
        {lat: 19.4438206, lng: -99.1978204},
        {lat: 19.4468657, lng: -99.2048264},
        {lat: 19.4470377, lng: -99.2051375},
        {lat: 19.4478066, lng: -99.2056739},
        {lat: 19.4498805, lng: -99.2099226},
        {lat: 19.4501132, lng: -99.2107272},
        {lat: 19.4503965, lng: -99.2120683},
        {lat: 19.4525007, lng: -99.2149651},
        {lat: 19.454271, lng: -99.2171752},
        {lat: 19.4557581, lng: -99.2187095},
        {lat: 19.4564258, lng: -99.2196214},
        {lat: 19.456355, lng: -99.2200184}
    ];

    // Construct the polygon.
    var polancoPolygon = new google.maps.Polygon({
        paths: polancoCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    polancoPolygon.setMap(map);
                              
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var infowindow = new google.maps.InfoWindow({
              content: "Ubicación actual."
            });
            var marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: 'Ubicación actual.'
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
            infowindow.open(map, marker);

            google.maps.geometry.poly.containsLocation(marker.getPosition(), polancoPolygon)?alert("YES"):alert("NO");

            map.setCenter(pos);
        }, 
        function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}