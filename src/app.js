require('dotenv').config();
require('../src/db/connection')
let express = require('express');
let chalk = require('chalk');
let PORT = process.env.PORT || 8000;
let hbs = require('hbs');
let path = require('path');
let router = require('./routes/router');
let auth = require('../src/middleware/auth');

//middlewares : 
let app = express();
app.use(router);


//static Host :
let staticPath = path.join(__dirname,'../src/templates/views');
app.use(express.static(staticPath));
//views :
let viewsPath = path.join(__dirname,'../src/templates/views');
app.set('view engine','hbs');
app.set('views',viewsPath);
//partials :
let partialPath = path.join(__dirname,'../src/templates/partials')
hbs.registerPartials(partialPath);




app.listen(PORT,(err)=>{
    if(err) console.log(chalk.red.inverse(err));
    else console.log(chalk.green.inverse(`Listening at PORT ${PORT}`));
});


