require('dotenv').config();
const express= require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const app= express();
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const user=mongoose.model('user',userSchema);

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post("/register",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;

    //inserting the details to a database
    let newUser= new user({
        email:email,
        password:password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render('secrets');
        }
    })
});

app.post("/login",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;

    //checking
    user.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(password===foundUser.password){
                res.render('secrets');
            }
            else{
                res.send(`<h1>Ooops.....</h1>`);
            }
        }
    })
});





app.listen(80,()=>{
    console.log("Server is running on port 80...");
})
