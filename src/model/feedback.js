let mongoose = require('mongoose');
let validator = require('validator');

let feedbackSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        minlength : [2,"Minimun length of name must be 2 characters"],
        trim:true,
    },
    email : {
        type:String,
        unique:true,
        required:true,
        validate(Value){
           let res =  validator.isEmail(Value);
           if(res==false){
            throw new Error("Enter a valid Email Address");
           }
        },
        trim:true,
    },
    message : {
        type : String,
        required:true,
        minlength : [5,'Minimum Length of feedback must be 5'],
        maxlength : [100,'Maximum Length of feedback must be 100'],
    },
    time : {
        type : Date,
        default : Date.now(),
    }
});

//creating a collecion named : Feedback

let feedbackCollection = new mongoose.model('feedbackList',feedbackSchema);

module.exports = feedbackCollection;