require('dotenv').config();
let express = require('express');
let router = new express.Router();
let bcrypt = require('bcrypt');

//PROCESS ENV'S : 
let pepper = process.env.PEPPER;

//DATABASES:
let feedbackCollection = require('../model/feedback');
let userCollection = require('../model/user');

//middlewares :
router.use(express.json());
router.use(express.urlencoded({extended:false}));



// NO-LOGIN REQUIRED
router.get('/',(req,res)=>{
    try {
        res.status(200).render('index');
    } catch (error) {
        res.status(400).send(error);
    }
});

// NO-LOGIN REQUIRED
router.get('/register',(req,res)=>{
    res.status(200).render('register');
});

// NO-LOGIN REQUIRED
router.post('/register',async(req,res)=>{
    try {
        let userData = req.body;
        let name = userData.name;
        let email = userData.email;
        let contact = userData.contact;
        let password = userData.password;

        //adding pepper - STORED IN .env
        const pepperedPassword = password + pepper;

        //salt - generation
        let salt = await bcrypt.genSalt(10);
        
        //hashedPassword 
        let hashedPassword = await bcrypt.hash(pepperedPassword,salt);

        let userDoc = new userCollection({
            name:name,
            email:email,
            contact:contact,
            password:hashedPassword,
        });

       let newUser = await userDoc.save();
      
       res.status(200).render('login',{name:newUser.name});
    } catch (error) {
      res.status(400).send(error);
    }
   
});

router.get('/login',(req,res)=>{
    res.render('login');
});

// LOGIN - REQUIRED
router.get('/about',(req,res)=>{
    res.status(200).send('i love you kunal');
});

// LOGIN - REQUIRED
router.post('/feedback',async(req,res)=>{
    let userName = req.body.name;
    let userEmail = req.body.email;
    let message = req.body.message;
    try {
        let document = new feedbackCollection({
            name:userName,
            email:userEmail,
            message:message
        });
        let result = await document.save();
        if(result){
            res.status(200).render('feedback', { mess: "Successfully Uploaded Feedback" });
        }
    } catch (error) {
        console.log(error)
       res.status(400).render('feedback');
    }
});

// LOGIN - REQUIRED
router.get('/feedback',(req,res)=>{
    res.status(200).render('feedback')
});

module.exports = router;