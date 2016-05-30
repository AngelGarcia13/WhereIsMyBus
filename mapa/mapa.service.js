(function() {
    'use strict';

    angular
        .module('mapa')
        .factory('MapaService', MedicosService);

    MedicosService.$inject = ['$http', '$q'];
    function MedicosService($http, $q) {
        // Get a reference to the database service
        var database = firebase.database();
        var markers = [];
        var map = null;
        var circle;
        var markerCenter;
        var selectedMarker = null;
        var GeoMarker;
        var infoWindow;
        var watchOptions = {
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
        };

        var service = {
            initMap: initMap
        };

        return service;

        ///////////////

        function initMap() {
            angular.element(document).ready(function() {
                initializeMap();
            });
        }

        function initializeMap() {
            // $ionicLoading.show({
            // 	templateUrl: 'templates/loading.html',

            // });
            console.log("loading map...");

            var options = { timeout: 10000, enableHighAccuracy: true };
            var myStyles = [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ];
            var latLng = new google.maps.LatLng(18.8583021, -69.7292113);

            var mapOptions = {
                center: latLng,
                zoom: 9,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: myStyles,
                disableDefaultUI: true
            };

            infoWindow = new google.maps.InfoWindow({
                content: '...'
            });
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //Load the markers
            //Wait until the map is loaded
            google.maps.event.addListenerOnce(map, 'idle', function() {
                //Load the markers
                loadMarkers();

                console.log("map loaded.")

            });
            //Close the infoWindow when click on the map
            google.maps.event.addListener(map, "click", function(event) {
                infoWindow.close();
            });
        }

        function removeMarkers() {
            /* Remove All Markers */
            // while(markers.length){
            //     markers.pop().setMap(null);
            // }
            for (var key in markers) {
                markers[key].setMap(null);
                markers.splice(key, 1);
            }

        }

        function loadMarkers() {
            var icon = new google.maps.MarkerImage("assets/img/ic_google_map_marker.png", null, null, null, new google.maps.Size(40, 40));
            //Get all of the markers from our Markers factory
            firebase.database().ref('busses/').on('value', function(bus) {
                removeMarkers();
                var data = bus.val();
                for (var property in data) {
                    if (data.hasOwnProperty(property)) {
                        var record = data[property];
                        var markerPos = new google.maps.LatLng(record.latitude, record.longitude);
                        var infoWindowContent = document.createElement('a');
                        //infoWindowContent.setAttribute('href', '#/detail/' + record.name.trim());
                        infoWindowContent.setAttribute('style', 'display: block;text-decoration: none;');
                        var infoWindowContent2 = document.createElement('div');
                        infoWindowContent2.innerHTML = "<b class='infoWindowTitle'>" + record.name + "</b>";
                        infoWindowContent.appendChild(infoWindowContent2);
                        // Add the marker to the map
                        var marker = new google.maps.Marker({
                            map: map,
                            icon: icon,
                            //animation: google.maps.Animation.DROP,
                            position: markerPos,
                            html: infoWindowContent
                        });

                        addInfoWindow(marker, property);
                        //markers.push(marker);
                        markers[property] = marker;

                        //console.log(data[property].name + ", longitude: " + data[property].longitude + ", latitude: " + data[property].latitude)
                    }
                }
                zoomMarker();
            });

        }

        function addInfoWindow(m, key) {
            google.maps.event.addListener(m, 'click', function() {
                selectedMarker = key;
                infoWindow.setContent(this.html);
                infoWindow.open(map, this);
            });

        }
        function showInfo(m) {
            infoWindow.setContent(m.html);
            infoWindow.open(map, m);
        }
        function zoomMarker() {

            if (selectedMarker != null) {
                showInfo(markers[selectedMarker]);
                map.setZoom(17);
                map.panTo(markers[selectedMarker].position);
            }

        }

    }
})();