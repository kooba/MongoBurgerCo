var fs = require('fs')
    , csv = require('csv')
    , mongo = require('./mongoose')
    , util = require('util');
;

mongo.connect('mongodb://localhost/restaurants', function (error) {
    if (error) throw error;
});

/**
 * Initialize app, load restaurants from CSV if not yet loaded.
 *
 */
exports.init = function (callback) {
    mongo.countRestaurants(function (error, count) {
        //TODO: Show progress in UI when loading retaurants for the first time.
        if (error === null) {
            if (count === 0) {
                csv()
                    .from(fs.createReadStream('./data/restaurants.csv'), {columns: true})
                    .on('record', function (row, index) {
                        mongo.add(
                            row.Name,
                            row.Street,
                            row.City,
                            row.PostCode,
                            row.Phone,
                            row.Latitude,
                            row.Longitude,
                            row.DriveThruArea,
                            row.DeliveryArea,
                            function (result) {
                                console.log(result);
                            }
                        )
                    })
                    .on('end', function(){
                        callback(true, 'Successfully loaded restaurants')
                    })
                ;
            } else {
                console.log('Restaurants already loaded');
                callback(true, 'Restaurants already loaded')
            }
        } else {
            callback(false, error.message);
        }
    })
}

