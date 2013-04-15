var csv = require('csv')
    , util = require('util')
    , db = require('./mongoose')
    , server = require('./server')
;

//db.connect('mongodb://localhost/restaurants', function (error) {
//    if (error) throw error;
//});

var username, password, params, next;

/**
 * Initialize app.
 *
 * @params {Object} parameters.
 * @callback {Function} callback function.
 * @api public
 */
exports.init = function (p, callback) {

    params = p;

    var app;

    server.init(params, function(express, encodedUsername, encodedPassword){
        app = express;
        username = encodedUsername;
        password = encodedPassword;
    });

    //params.config.copyrightyear = moment(new Date()).format("YYYY");
    require('./routes')(app, this);


    db.initializeRestaurants(callback);
}

exports.index = function(req, res){
    res.render('index', {
        title: params.config.project,
        description: 'Lots of fun with Node and Mongo',
        keywords: 'Mongo Spatial example'
    });
}



