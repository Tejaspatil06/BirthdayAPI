var express = require('express');
var controller = require('./controller/birthdaycontroller');




var app = express();




controller(app);




app.listen(3000);
console.log('Listening to port 3000');