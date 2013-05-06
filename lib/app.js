var csv = require('csv')
, util = require('util')
, db = require('./mongoose')
, server = require('./server')
, polyLine = require('polyline')
, simplify = require('simplify-js')
;

var params, app;

/**
 * Initialize app.
 *
 * @params {Object} parameters.
 * @callback {Function} callback function.
 * @api public
 */
exports.init = function (p, callback) {

    params = p;

    server.init(params, function (express) {
        app = express;
    });

    require('./routes')(app, this);

    db.initializeRestaurants(callback);
}

/**
 * Index page
 */

exports.index = function (req, res) {
    res.render('index', {
        title: params.config.project,
        description: 'Lots of fun with Node and Mongo',
        keywords: 'Mongo Spatial example',
        menu: 'home'
    });
}

/**
 * Show all restaurants on the map
 */

exports.map = function (req, res) {
    res.render('map', {
        title: 'Restaurants Map',
        menu: 'map'
    });
}

/**
 * Show restaurants close to your area.
 */
exports.eatin = function (req, res) {
    res.render('eatin', {
        title: 'Restaurants Eat-in',
        menu: 'eatin'
    });
}

/**
 * Show restaurants that deliver
 */
exports.delivery = function (req, res) {
    res.render('delivery', {
        title: 'Restaurants Delivery',
        menu: 'delivery'
    });
}

/**
 * Show restaurants along your driving route
 */
exports.drivethru = function (req, res) {
    res.render('drivethru', {
        title: 'Restaurants Drivethru',
        menu: 'drivethru'
    });
}

/**
 * Get restaurants within map Polygon
 */
exports.getRestaurantsWithinArea = function (req, res) {
    db.restaurants.find({ location: { $geoWithin: { $geometry: { type: "Polygon",
        coordinates: [
            [
                [ parseFloat(req.query.northWest.lng) , parseFloat(req.query.northWest.lat) ] ,
                [ parseFloat(req.query.northEast.lng) , parseFloat(req.query.northEast.lat) ] ,
                [ parseFloat(req.query.southEast.lng) , parseFloat(req.query.southEast.lat) ] ,
                [ parseFloat(req.query.southWest.lng) , parseFloat(req.query.southWest.lat) ] ,
                [ parseFloat(req.query.northWest.lng) , parseFloat(req.query.northWest.lat) ]
            ]
        ]
    } } } }, function (err, docs) {
        var restaurants = [];

        if (err) {
            console.log(err);
        } else {

            docs.forEach(function (elem) {
                restaurants.push(elem.toObject());
            });
        }

        res.json(restaurants);
    });

}

/**
 * Get restaurants closest to a Point
 */
exports.getRestaurantsClosestToPoint = function (req, res) {
    db.restaurants.find({ location: { $near: { $geometry: { type: "Point",
        coordinates: [ parseFloat(req.query.longitude), parseFloat(req.query.latitude) ]}},
        $maxDistance: 25 * 1000
    }}, function (err, docs) {
        var restaurants = [];

        if (err) {
            console.log(err);
        } else {

            docs.forEach(function (elem) {
                restaurants.push(elem.toObject());
            });
        }

        res.json(restaurants);
    });
}

/**
 * Get restaurants which deliver within your area.
 * Search for Point within delivery Polygon
 */
exports.getDeliveryRestaurantsClosestToPoint = function (req, res) {
    db.restaurants.find({ deliveryArea: { $geoIntersects : { $geometry: { type: "Point",
        coordinates: [ parseFloat(req.query.longitude), parseFloat(req.query.latitude) ]}}
    }}, function (err, docs) {
        var restaurants = [];

        if (err) {
            console.log(err);
        } else {

            docs.forEach(function (elem) {
                restaurants.push(elem.toObject());
            });
        }

        res.json(restaurants);
    });
}

/**
 * Mongo currently doesn't support querying along polyline.
 * This is workaround that simplifies polyline with Douglas-Peucker algo to minimize db calls .
 * more info: https://jira.mongodb.org/browse/SERVER-4339
 */
exports.getDriveThruRestaurantsOnTheWay = function (req, res) {

    //Decode Google encoded polyline
    //Flips the pairs to be compatible with GeoJSON.
    var decodedPolyLine = polyLine.decodeLine(req.query.polyline) ;

    //Create set of points in format required for simplification
    var points = [];
    decodedPolyLine.forEach(function(elem){
        points[points.length] = {x: elem[0], y:elem[1]};
    });

    //Simplify polyline to make less DB calls
    var simplifiedPolyline = simplify.simplify(points, 0.006);


    //Simple lock to synchronize async calls for response
    var lock = simplifiedPolyline.length;
    var finishRequest = function() {
        lock -= 1;
        if(lock === 0){
            res.json(deduplicateRestaurants(restaurants));
        }
    }

    //Separate search for each polyline point. Might not be a good idea in production.
    var restaurants = [];
    simplifiedPolyline.forEach(function(elem){

        db.restaurants.find({ driveThru: true, location: { $near: { $geometry: { type: "Point",
            coordinates: [ parseFloat(elem.y), parseFloat(elem.x)]}},
            $maxDistance: 5 * 1000
        }}, function (err, docs) {

            if (err) {
                console.log(err);
            } else {

                docs.forEach(function (elem, index, array) {
                    restaurants.push(elem.toObject());
                });
            }

            finishRequest();
        });

    });

}

/**
 * Deduplicate repeated results.
 * Multiple searches with Points close to each other can return the same restaurants.
 * @param restaurants
 * @returns {Array}
 * @api private
 */
function deduplicateRestaurants(restaurants){

    var uniqueNames = [];
    var uniqueRestaurants = [];

    restaurants.forEach(function(elem){
        if(uniqueNames.indexOf(elem.name) < 0){
            uniqueNames.push(elem.name);
            uniqueRestaurants.push(elem);
        }
    });

    return uniqueRestaurants;
}



