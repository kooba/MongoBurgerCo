var util = require('util'),
    mongoose = require('mongoose'),
    fs = require('fs');

var schema = mongoose.Schema;
//TODO: This is hack. There seems to be no way to set empty polygon for retaurants that don't deliver. This polygon is in the middle of North Sea.
var defaultDeliveryArea = "[[[2.233315,53.174765],[2.233315,53.172913],[2.230225,53.172913],[2.230225,53.174765],[2.233315,53.174765]]]";

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

var RestaurantSchema = new schema({
  name  : String,
  street  : String,
  city  : String,
  postCode  : String,
  phone  : String,
  latitude : Number,
  longitude : Number,
  driveThru  : Boolean,
  deliveryArea  : { type: { type: String }, coordinates: []},
  location : { type: { type: String }, coordinates: []}
});

RestaurantSchema.index({ deliveryArea: '2dsphere' });
RestaurantSchema.index({ location: '2dsphere' });

mongoose.model('Restaurant', RestaurantSchema);
var Restaurant = mongoose.model('Restaurant');

exports.restaurants = Restaurant;

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
 * @param {String} driveThru
 * @param {String} deliveryArea
 * @param {Function} callback
 * @api public
 */
exports.add = function(name, street, city, postCode, phone, latitude, longitude, driveThru, deliveryArea, callback) {
  var restaurant = new Restaurant();
  restaurant.name = name;
  restaurant.street = street;
  restaurant.city = city;
  restaurant.postCode = postCode;
  restaurant.phone = phone;
  restaurant.latitude = latitude;
  restaurant.longitude = longitude;
  restaurant.driveThru = driveThru;

  if(deliveryArea.length > 0) {
      restaurant.deliveryArea.type = 'Polygon';
      restaurant.deliveryArea.coordinates = JSON.parse(deliveryArea);
  }
  else {
      restaurant.deliveryArea.type = 'Polygon';
      restaurant.deliveryArea.coordinates = JSON.parse(defaultDeliveryArea);
  }

  restaurant.location.type = 'Point';
  restaurant.location.coordinates = [ parseFloat(longitude), parseFloat(latitude) ];
  
  restaurant.save(function(err) {
    if (err) {
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

    var rowCount = 0;
    var fileReadDone = false;
    var finishLoading = function(){
        if(rowCount === 0 && fileReadDone){
            callback(null, 'Successfully loaded restaurants');
        }
    }

    csv()
        .from(fs.createReadStream('./data/restaurants.csv'), {columns: true})
        .on('record', function (row) {
            rowCount += 1;
            exports.add(
                row.Name,
                row.Street,
                row.City,
                row.PostCode,
                row.Phone,
                row.Latitude,
                row.Longitude,
                row.DriveThru,
                row.DeliveryArea,
                function (err) {
                    if(err){
                        callback(err);
                    }
                    rowCount -= 1;
                    finishLoading();
                }
            )
        })
        .on('end', function(){
            fileReadDone = true;
            finishLoading();
        })
        .on('error', function(err){
            callback(err, err.message);
        });
}

