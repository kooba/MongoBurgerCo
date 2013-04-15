var app = require('./lib/app');

app.init(function(err, message){
    if(err){
        console.log('Failed to initialized app, ' + err.message);
    } else{
        console.log('Successfully initialized app, ' + message);
    }
});