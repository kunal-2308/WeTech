require('dotenv').config();
let express = require('express');
let router = new express.Router();
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let cookieParser = require('cookie-parser');
let auth = require('../middleware/auth');

//PROCESS ENV'S : 
let pepper = process.env.PEPPER;

//DATABASES:
let feedbackCollection = require('../model/feedback');
let userCollection = require('../model/user');

//middlewares :
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({extended:false}));


 //-------------------------------------ROUTES WITH NO LOGIN REQUIRED-------------------------------------//


// router.get('/',(req,res)=>{
//     try {
//         res.status(200).render('index');
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });



router.get('/register',(req,res)=>{
    res.status(200).render('register');
});



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

const tenDaysInMilliseconds = 10 * 24 * 60 * 60 * 1000;

router.post('/login',async(req,res)=>{
    try {

        let userLoginDetails = req.body;
        let userLoginEmail = userLoginDetails.email;
        let userLoginPassword = userLoginDetails.password;
        
        let dbPassword = await userCollection.findOne({"email":userLoginEmail},{password:1,_id:0});
        let password = dbPassword.password;

        if (!dbPassword) {
            return res.status(400).send("User not found");
        }

        const pepperedPassword = userLoginPassword + pepper;

        await bcrypt.compare(pepperedPassword, password);
        
        //creating a Web token :
        let token =  jwt.sign(userLoginEmail,process.env.SECRET_KEY);
        
        // Creating a Cookie :
        res.cookie('jwt_login',token,{
            maxAge : tenDaysInMilliseconds,
            httpOnly : true,
        });

        let Data = await userCollection.findOne({"email":userLoginEmail},{_id:0,name:1});
        let userName = Data.name;
        res.status(200).render('index',{loggedIn:true,name:userName});
    
    } catch (error) {
        res.status(400).send(error);
    }
});


 //-------------------------------------ROUTES WITH LOGIN REQUIRED-------------------------------------//

router.get('/',auth,async(req,res)=>{
   try {
    let userEmail = req.email;
    let userName = await userCollection.findOne({"email":userEmail},{_id:0,name:1});
    if(!userName){
        res.send(401).render('login');
    }
    let name = userName.name;
        res.status(200).render('index',{loggedIn:true,name})
   } catch (error) {
        res.status(400).send('index');
   }
});
router.get('/about',auth,(req,res)=>{
    let userEmail = req.email;
    res.status(200).send(userEmail);
});

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


router.get('/feedback',(req,res)=>{
    res.status(200).render('feedback')
});




module.exports = router;