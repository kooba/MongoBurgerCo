$(function () {

    var gmapLayer = new L.Google('ROADMAP');
    var resultsLayer = L.layerGroup();

    var map = L.map('map', {
        layers: [gmapLayer, resultsLayer],
        center: [51.5021, -0.122737],
        zoom: 12,
        maxBounds: L.latLngBounds([49, 15], [60, -25])
    });

    var loadMarkers = function () {
        resultsLayer.clearLayers();
        if (map.getZoom() > 9) {
            var bounds = map.getBounds();
            $.get('/getRestaurantsWithinArea', {
                northWest: { lng : bounds.getNorthWest().lng, lat: bounds.getNorthWest().lat },
                northEast: { lng : bounds.getNorthEast().lng, lat: bounds.getNorthEast().lat },
                southEast: { lng : bounds.getSouthEast().lng, lat: bounds.getSouthEast().lng },
                southWest: { lng : bounds.getSouthWest().lng, lat: bounds.getSouthWest().lat }
            }).done(function(restaurants) {
                $.each(restaurants, function(index, value) {
                    var marker = L.marker([value.latitude, value.longitude])
                        .bindPopup(
                            '<p><strong>' + value.name + '</strong><br />' +
                                value.street + '<br />' +
                                value.city + '<br />' +
                                value.postCode + '<br />' +
                                value.phone + '</p>'
                        );
                    resultsLayer.addLayer(marker);
                });
            });
        }
    };

    loadMarkers();
    map.on('moveend', loadMarkers);
});