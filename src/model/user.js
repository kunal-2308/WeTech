let express = require('express');
let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate(value) {
            let res = validator.isEmail(value);
            if (res == false) {
                throw new Error("Enter a valid Email");
            }
        }
    },
    contact: { // This should match the form input name
        type: String, // Keep this as String since phone numbers can have various formats
        required: true,
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            let res = validator.isStrongPassword(value);
            if (res == false) {
                throw new Error("Enter a strong password");
            }
        }
    },
    accountCreate: {
        type: Date,
        default: Date.now(),
    }
});
//creating a collection for All Users :

//this 3rd parameter i created manually by creating index of email which is unique 
//check the commands on GPT how to create index on email for unique : true
let userCollection = new mongoose.model('user',userSchema);

module.exports = userCollection;