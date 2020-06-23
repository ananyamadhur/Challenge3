// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbnlhbWFkaHVyIiwiYSI6ImNrYjd0ZWp5aDA1MzgyeXFyZnUwZms3ZjgifQ.4_0hH-ABynVLvuT0ar9o5w';

//map with  versions and switch
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 1.2,
center: [65.322840, 52.067101],
});

//switch between the themes
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
 
function switchLayer(layer) {
var layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
}
 
for (var i = 0; i < inputs.length; i++) {
inputs[i].onclick = switchLayer;
}

// locations with description
var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [115.0920,8.3405 ]
    },
    properties: {
      name: 'Bali',
      description: 'Land of the Gods'    
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0.1278,51.5074 ]
    },
    properties: {
      name: 'London',
      description: 'Big Ben'
    }       
  },
{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [72.8777,19.0760 ]
    },
    properties: {
      name: 'Mumbai',
      description: 'City of lights'
    }
}
		]
};

// add markers to map
geojson.features.forEach(function(marker) {

// create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

 // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el)
	.setLngLat(marker.geometry.coordinates)
    .setPopup(
    new mapboxgl.Popup({ offset: 25 }) 

// add popups
.setHTML('<h3>' + marker.properties.name + '</h3><p>' + marker.properties.description +'</p>' + '<div id="'+marker.properties.name+'"> '+'windspeed:'+marker.properties.windspeed + '<br>' + 'temperature:' + marker.properties.temp + '<br>' + 'humidity:' + marker.properties.humidity+'</div>'  )
		)				
          .addTo(map);
});

//weather
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '05a45b183f4b521f32e248c62c47fabc';

// Determine cities
var cities = [
  {
    name: 'Bali',
    coordinates: [115.0920,8.3405],
  },
  {
    name: 'London',
    coordinates: [0.1278,51.5074]
  },
  {
    name: 'Mumbai',
    coordinates: [72.8777,19.0760]
  }
];

// get weather data and plot on map
map.on('load', function () {
  cities.forEach(function(city) {
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        for(i=0;i>geojson.features.length;i++) 
        { 
            console.log(geojson.features[i].properties);
            if(geojson.features[i].properties.name==city.name) {
                geojson.features[i].properties.windspeed=response.wind.speed;
                city.windspeed=response.wind.speed; 
                
                geojson.features[i].properties.temp=response.main.temp -273;
                city.temp=response.main.temp -273;
                
                geojson.features[i].properties.humidity=response.main.humidity;
                city.humidity=response.main.humidity;
                document.getElementById(city.name).innerHTML='windspeed:'+city.windspeed + '<br>' + 'temperature:' + city.temp + '<br>' + 'humidity:' + city.humidity;
                
            }
        }
        
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1
        }
      });
    }
  );
};



	





















/*
var places = [
	{
		name: 'Bali',
		location: {lat:8.3405,lng: 115.0920},
	}, {
		name: 'London',
		location: {lat: 51.5074, lng: 0.1278},
	}, {
		name: 'Mumbai',
        description:'hello',
		location: {lat: 19.0760,lng: 72.8777},
	},
];*/

/* // Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',

  // Positioning the map on a certain longitute + latitude and zooming in
  center: [65.322840, 52.067101],
    zoom: 1,
});*/

/*
for(var i=0; i< places.length; i++){
	var myCustomMarker = document.createElement('div');
	myCustomMarker.className = 'customMarker';
	myCustomMarker.innerHTML = places[i].name;

	// Adding a marker based on lon lat coordinates
	var marker = new mapboxgl.Marker(myCustomMarker).setLngLat([places[i].location.lng, places[i].location.lat]).addTo(map);
} */

/*var myPopup = new mapboxgl.Popup().setHTML('<h3>De Haagse Hogeschool</h3><p>Closed right now</p>');

/*
// Adding a marker based on lon lat coordinates
var marker = new mapboxgl.Marker().setLngLat([4.324439, 52.067200]).setPopup(myPopup).addTo(map);

var marker = new mapboxgl.Marker().setLngLat([4.324439, 52.067200]).setPopup(myPopup).addTo(map);

var marker = new mapboxgl.Marker().setLngLat([4.324439, 52.067200]).setPopup(myPopup).addTo(map);

//theme switcher 
function darkMode() {
   var element = document.body;
   element.classList="dark-mode";
}

function originalMode() {
   var element = document.body;
   element.classList="";
}
*/

/*mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbnlhbWFkaHVyIiwiYSI6ImNrYjd0ZWp5aDA1MzgyeXFyZnUwZms3ZjgifQ.4_0hH-ABynVLvuT0ar9o5w';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.322840, 52.067101],
  zoom: 15,
});

// location search
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  }),
  'bottom-left'
);

//pin spots
var myPopup = new mapboxgl.Popup().setHTML('<h3>Hello</h3>');

// Adding a marker based on lon lat coordinates
var marker = new mapboxgl.Marker().setLngLat([4.324439, 52.067200]).setPopup(myPopup).addTo(map);*/