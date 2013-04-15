var app = require('./lib/app');

params = {
    config: {
        project: 'Mongo Burger Company'
//        public: '/../public',
//        per_page: '10'
    },
    dev: {
        user: 'user',
        pass: 'password',
        port: '3000',
        db:   'mongodb://localhost/MongoBurgerCo'
    },
    prod: {
        user: 'user',
        pass: 'password',
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