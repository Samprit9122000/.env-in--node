// require('dotenv').config();
const express= require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const app= express();
const mongoose=require('mongoose');
// const encrypt=require('mongoose-encryption');
// const md5=require('md5');
const exsession=require('express-session');
const passport=require('passport');
const passMongoose=require('passport-local-mongoose')
const localStrategy=require('passport-local').Strategy;

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(exsession({
    secret:"i have many secrets.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});


const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passMongoose);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});



const user=mongoose.model('user',userSchema);

passport.use(user.createStrategy({usernameField:'email'},user.authenticate()));
// passport.use(new localStrategy({usernameField:'email'},user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get("/secrets",(req,res)=>{
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        res.render('secrets');

    }
    else{
        res.redirect("/login");
    }
})



// app.post('/register',(req,res)=>{
//     let email=req.body.email;
//     let password=req.body.password;
//     let newuser=new user({
//             email:email,
//             password:password
//     })
//     newuser.save(function(err){
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.render('secrets');
//         }
//     })
// })

app.post("/register",(req,res)=>{
    user.register({username:req.body.email},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            console.log('in authenticate')
            passport.authenticate("local")(req,res,function(){
                console.log("cookie is created...");
                res.redirect("/secrets");
            })
            
        }
    })
})





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
