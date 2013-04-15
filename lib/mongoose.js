var util = require('util'),
    mongoose = require('mongoose'),
    fs = require('fs');
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
  var restaurant = new Restaurant();
  restaurant.name = name;
  restaurant.street = street;
  restaurant.city = city;
  restaurant.postCode = postCode;
  restaurant.phone = phone;
  restaurant.latitude = latitude;
  restaurant.longitude = longitude;
  restaurant.driveThruArea = driveThruArea;
  restaurant.deliveryArea = deliveryArea;
  
  restaurant.save(function(err) {
    if (err) {
      util.log('FATAL ' + err);
      callback(err);
    } else
      callback(null);
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

/**
 * Load restaurants if not loaded yet.
 *
 * @param {Function} callback function
 * @api public
 */
exports.initializeRestaurants = function (callback){
    exports.countRestaurants(function (err, count) {
        if (err) {
            callback(err);
        } else {
            if (count === 0) {
                loadRestaurants(function(err, message){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, message);
                    }

                })
            } else {
                callback(null, 'Restaurants already loaded')
            }
        }
    })
}

/**
 * Load restaurants from CSV file.
 *
 * @param callback
 * @api private
 */
function loadRestaurants(callback){
    csv()
        .from(fs.createReadStream('./data/restaurants.csv'), {columns: true})
        .on('record', function (row, index) {
            exports.add(
                row.Name,
                row.Street,
                row.City,
                row.PostCode,
                row.Phone,
                row.Latitude,
                row.Longitude,
                row.DriveThruArea,
                row.DeliveryArea,
                function (err) {
                    if(err){
                        callback(err);
                    }
                }
            )
        })
        .on('end', function(){
            callback(null, 'Successfully loaded restaurants');
        })
        .on('error', function(err){
            callback(err, err.message);
        });
}

