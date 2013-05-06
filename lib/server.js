var db = require('./mongoose')
    , path = require('path')
    , http = require('http')
    , express = require('express')
    ;



/**
 * Setup the server and framework with the provided params.
 *
 * @params {Object} the params
 * @callback {Function} the callback function
 * @api public
 */
exports.init = function(params, callback){

    var app = express();
    app.use(express.errorHandler());

    app.configure('development', function(){
        db.connect(params.dev.db, function(error) {
            if (error) throw error;
        });
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    });

    app.configure('production', function(){
        db.connect(params.prod.db, function(error) {
            if (error) throw error;
        });
        app.use(express.errorHandler());

    });

    app.configure(function()
    {
        app.set('port', process.env.PORT || params.dev.port);
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, '/../public')));
    });

    app.locals.pretty = true

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });


    app.on('close', function(errno) {
        this.close();
    });
    callback(app);

}