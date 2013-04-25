var csv = require('csv')
    , util = require('util')
    , db = require('./mongoose')
    , server = require('./server')
    ;

//db.connect('mongodb://localhost/restaurants', function (error) {
//    if (error) throw error;
//});

var username, password, params, app;

/**
 * Initialize app.
 *
 * @params {Object} parameters.
 * @callback {Function} callback function.
 * @api public
 */
exports.init = function (p, callback) {

    params = p;

    server.init(params, function (express, encodedUsername, encodedPassword) {
        app = express;
        username = encodedUsername;
        password = encodedPassword;
    });

    //params.config.copyrightyear = moment(new Date()).format("YYYY");
    require('./routes')(app, this);


    db.initializeRestaurants(callback);
}

exports.index = function (req, res) {
    res.render('index', {
        title: params.config.project,
        description: 'Lots of fun with Node and Mongo',
        keywords: 'Mongo Spatial example',
        menu: 'home'
    });
}

exports.map = function (req, res) {
    res.render('map', {
        title: 'Restaurants Map',
        menu: 'map'
    });
}

exports.eatin = function (req, res) {
    res.render('eatin', {
        title: 'Restaurants Eat-in',
        menu: 'eatin'
    });
}

exports.delivery = function (req, res) {
    res.render('delivery', {
        title: 'Restaurants Delivery',
        menu: 'delivery'
    });
}

exports.drivethru = function (req, res) {
    res.render('drivethru', {
        title: 'Restaurants Drivethru',
        menu: 'drivethru'
    });
}

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

            docs.forEach(function (elem, index, array) {
                restaurants.push(elem.toObject());
            });
        }

        res.json(restaurants);
    });

}

exports.getRestaurantsClosestToPoint = function (req, res) {
    db.restaurants.find({ location: { $near: { $geometry: { type: "Point",
        coordinates: [ parseFloat(req.query.longitude), parseFloat(req.query.latitude) ]}},
        $maxDistance: 25 * 1000
    }}, function (err, docs) {
        var restaurants = [];

        if (err) {
            console.log(err);
        } else {

            docs.forEach(function (elem, index, array) {
                restaurants.push(elem.toObject());
            });
        }

        res.json(restaurants);
    });
}





