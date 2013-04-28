$(function () {

    var gmapLayer = new L.Google('ROADMAP');
    var resultsLayer = L.layerGroup();
    var polygonLayer = L.featureGroup();
    

    var map = L.map('map', {
        layers: [gmapLayer, polygonLayer, resultsLayer],
        center: [54.14, -4.48],
        zoom: 6,
        maxBounds: L.latLngBounds([49, 15], [60, -25])
    });

    $('#location').locationSelector(map);

    $('#location').change(function () {
        var latlng = $('#location').locationSelector('val');
        map.setView(latlng, 12);
        
        polygonLayer.clearLayers();
        resultsLayer.clearLayers();
        
        resultsLayer.addLayer(L.circleMarker(latlng, { color: '#ff0000' }));
        
        var markerClick = function () {
            var polygon = L.GeoJSON.geometryToLayer(this.data.deliveryArea);
            polygonLayer.clearLayers();
            polygonLayer.addLayer(polygon);
            map.fitBounds(polygon.getBounds());
        };
        
        $.get('/getDeliveryRestaurantsClosestToPoint', {
            latitude: latlng[0],
            longitude: latlng[1]
        }).done(function (restaurants) {
            $.each(restaurants, function (index, value) {
                var marker = L.marker([value.latitude, value.longitude])
                    .bindPopup(
                        '<p><strong>' + value.name + '</strong><br />' +
                        value.street + '<br />' +
                        value.city + '<br />' +
                        value.postCode + '<br />' +
                        value.phone + '</p>'
                    )
                    .on('click', markerClick);
                marker.data = value;
                resultsLayer.addLayer(marker);
            });
            //map.fitBounds(resultsLayer.getBounds());
        });
    });
});