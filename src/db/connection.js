const chalk = require('chalk');
let mongoose = require('mongoose');
let connect = async() =>{
    try {
        await mongoose.connect('mongodb://localhost:27017/MERNWEB');
        console.log(chalk.green.inverse('Connected to DB Successfully'));
    } catch (error) {
        console.log(chalk.red.inverse(error));
    }
    
 
}
connect();

module.exports = connect;