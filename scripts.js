mapboxgl.accessToken = 'pk.eyJ1IjoiZGFzMjY0IiwiYSI6ImNrdXl4NXpxYTc3Mmsyd3E2ZDZ6bm55b3cifQ.o7GVvvktEJvo_MAGbb8MCw'
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-122.4443, 47.2529],
  zoom: 10
});


map.on('load', function() {
  map.addLayer({
    id: 'hospitals',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: hospitalPoints
    },
    layout: {
      'icon-image': 'hospital-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });

  map.addLayer({
    id: 'libraries',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: libraryPoints
    },
    layout: {
      'icon-image': 'library-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });

  map.addSource('nearest-hospital', {
   type: 'geojson',
   data: {
     type: 'FeatureCollection',
     features: [

     ]
   }
 });

});

var popup = new mapboxgl.Popup();

map.on('click', 'hospitals', function(e) {

  var feature = e.features[0];

  popup.setLngLat(feature.geometry.coordinates)
    .setHTML("<b>Name: </b>" + feature.properties.NAME + "<br><b>Address: </b>" + feature.properties.ADDRESS + "<br><b>City:</b> " + feature.properties.CITY + "<br><b>Zip Code:</b> " + feature.properties.ZIP)
    .addTo(map);
});

map.on('click', 'libraries', function(f) {

  var refLibrary = f.features[0];

  var nearestHospital = turf.nearest(refLibrary, hospitalPoints);

  map.getSource('nearest-hospital').setData({
      type: 'FeatureCollection',
      features: [nearestHospital]

});

    var imperial = {unit:'mile'}
    var distance = turf.distance(refLibrary, nearestHospital, imperial)

    map.addLayer({
      id: 'nearestHospitalLayer',
      type: 'circle',
      source: 'nearest-hospital',
      paint: {
        'circle-radius': 14,
        'circle-color': '#486DE0'
      }
    }, 'hospitals');


    popup.setLngLat(refLibrary.geometry.coordinates)
        .setHTML('<b>' + refLibrary.properties.NAME + '</b><br><b>Nearest Hospital:</b> ' + nearestHospital.properties.NAME + '<br><b>Address</b> ' + nearestHospital.properties.ADDRESS + ' <br><b>Approx. Distance: </b>' + distance.toFixed(2) + ' miles away.')
        .addTo(map);
});
