var app = require('./lib/app');

params = {
    config: {
        project: 'Mongo Burger Company'
    },
    dev: {
        port: '3000',
        db:   'mongodb://localhost/MongoBurgerCo'
    },
    prod: {
        db:   'mongodb://localhost/MongoBurgerCo'
    }
}

app.init(params, function(err, message){
    if(err){
        console.log('Failed to initialized app, ' + err.message);
    } else{
        console.log('Successfully initialized app, ' + message);
    }
});