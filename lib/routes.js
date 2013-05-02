/**
 * Specify the routes.
 *
 * @app {Object} the running app object
 * @mburger {Class} the MongoBurger class
 * @api public
 */
module.exports = function(app, mburger)
{
    app.get('/', mburger.index);
    app.get('/map', mburger.map);
    app.get('/eatin', mburger.eatin);
    app.get('/delivery', mburger.delivery);
    app.get('/drivethru', mburger.drivethru);
    app.get('/getRestaurantsWithinArea', mburger.getRestaurantsWithinArea);
    app.get('/getRestaurantsClosestToPoint', mburger.getRestaurantsClosestToPoint);
    app.get('/getDeliveryRestaurantsClosestToPoint', mburger.getDeliveryRestaurantsClosestToPoint);
    app.get('/getDriveThruRestaurantsOnTheWay', mburger.getDriveThruRestaurantsOnTheWay);
}