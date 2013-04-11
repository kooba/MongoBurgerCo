var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connection.on('error', function(err) {
	util.error(err.message);
});

/**
 * Connect to the database.
 *
 * @dburl {String} the database url
 * @callback {Function} callback function
 * @api public
 */
exports.connect = function(dburl, callback) {
  mongoose.connect(dburl);
}

/**
 * Disconnect from the database.
 *
 * @param {Function} callback function
 * @api public
 */
exports.disconnect = function(callback) {
  mongoose.disconnect(callback);
}

/**
 * Setup.
 *
 * @param {Function} callback function
 * @api public
 */
exports.setup = function(callback) { callback(null); }

var RestaurantSchema = new Schema({
  name  : String,
  street  : String,
  city  : String,
  postCode  : String,
  phone  : String,
  latitude : Number,
  longitude : Number,
  driveThruArea  : String,
  deliveryArea  : String,
});

mongoose.model('Restaurant', RestaurantSchema);
var Restaurant = mongoose.model('Restaurant');

/**
 * Add a new restaurant.
 *
 * @param {String} name
 * @param {String} street
 * @param {String} city
 * @param {String} postCode
 * @param {String} phone
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {String} driveThruArea
 * @param {String} deliveryArea
 * @param {Function} callback
 * @api public
 */
exports.add = function(name, street, city, postCode, phone, latitude, longitude, driveThruArea, deliveryArea, callback) {
  var newRestaurant = new Restaurant();
  newRestaurant.name = name;
  newRestaurant.street = street;
  newRestaurant.city = city;
  newRestaurant.postCode = postCode;
  newRestaurant.phone = phone;
  newRestaurant.latitude = latitude;
  newRestaurant.longitude = longitude;
  newRestaurant.driveThruArea = driveThruArea;
  newRestaurant.deliveryArea = deliveryArea;
  
  newRestaurant.save(function(err) {
    if (err) {
      util.log('FATAL '+ err);
      callback(err);
    } else
      callback('success');
  });
}

/**
 * Get a count of all restaurants.
 *
 * @param {Function} callback function
 * @api public
 */
exports.countRestaurants = function(callback) {
    Restaurant.count({}, function(err, doc) {
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}

