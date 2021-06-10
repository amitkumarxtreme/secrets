require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    username: String,
    password : String
});

console.log(process.env.API_KEY);
userSchema.plugin(encrypt , {secret :process.env.SECRETS, encryptedFields :["password"]});

const User = new mongoose.model("user" , userSchema);

app.get("/" , function(request,response) {
     response.render("home");
});

app.get("/login" , function(request,response) {
     response.render("login");
});

app.get("/register" , function(request,response) {
     response.render("register");
});

app.post("/register" , function(request,response) {
     const email = request.body.username;
     const password = request.body.password;
     
     const newUser = new User({
         username : email,
         password : password
     });

     newUser.save(function(err) {
         if(err) {
             console.log(err);
         } else {
             response.render("secrets");
         }
     });
               
});

app.post("/login" , function(request,response) {
    const email = request.body.username;
    const password = request.body.password;

    User.findOne({username : email} , function(err,foundUser) {
         if(err){
             console.log(err);
         } else {
             if(foundUser.password === password) {
                 response.render("secrets");
             } else {
                 console.log("Password Incorrect!"); 
             }
         }
    });
});

app.listen(3000 , function(){
    console.log("Server started running on port 3000");
});
