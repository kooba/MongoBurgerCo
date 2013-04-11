var app = require('./lib/app');

app.init(function(success, message){
    if(success){
        console.log('Successfully initialized app, ' + message);
    } else{
        console.log('Failed to initialized app, ' + message);
    }
});