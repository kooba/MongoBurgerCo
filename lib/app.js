var csv = require('csv')
    , db = require('./mongoose')
    , util = require('util');
;

db.connect('mongodb://localhost/restaurants', function (error) {
    if (error) throw error;
});

/**
 * Initialize app, load restaurants from CSV if not yet loaded.
 *
 */
exports.init = function (callback) {
    db.initializeRestaurants(callback);
}



