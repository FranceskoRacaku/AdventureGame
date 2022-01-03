//import * as express from "express";
const express = require("express");
const querystring = require("querystring");
var session = require('express-session');
const { process_params } = require("express/lib/router");
const { URLSearchParams } = require("url");
const app = express();
const port = process.env.PORT || 3400;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret :"sdasd",
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}))

app.set("view engine", "ejs");

app.get('/',(req,res)=>{
    let user ="";
    let punctuation="";
    let invalid_login = false;

    /*const url = req.url;
    console.log("my url is", url);
    var params = new URLSearchParams(url.substring(1));
    console.log("my params are", params);
    invalid_login = params.get("reason") || null;*/

    invalid_login = req.query.reason || null;
    /*console.log ("out quesry reason", req.query.reason);*/

    if (req.session && req.session.username){
        user = req.session.username;
        punctuation = ",";

    }
    res.render("index", {my_user: user, punctuation: punctuation, invalid_login: invalid_login});
});

app.post("/signup", (req,res)=> {
    const valid_users = [
        {"name": "Francesko", "password" : "112233"},
        {"name": "Jabair", "password" : "332211"},
        {"name": "Megan", "password" : "221133"},
        {"name": "Cody", "password" : "113322"},
        {"name": "Evan", "password" : "445566"},
        {"name": "Lee", "password" : "446655"},
        {"name": "Omaid", "password" : "556644"}
    ];
    const user = req.body.username;
    const pass = req.body.password;

    const found_user = valid_users.find(usr =>{
        return usr.name == user && usr.password == pass;
    });
    if (found_user){
        req.session.username = user;
        res.redirect("/main");
} else {
    req.session.destroy(() => {
        console.log("user reset");
    })
    res.redirect("/?reason=invalid_user");
}

});



app.get("/main", (req,res) => {
    if (req.session && req.session.username) {
        user = req.session.username;
        punctuation = ",";
        res.render("main", {my_user: user, punctuation: punctuation});
    } else{
        res.redirect("/");
    }
    
});


app.get("/warmup", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("warm", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("round1", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1/approach", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("approach", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1/alert", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("alert", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1/yourtheboss", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("yourtheboss", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1/yourtheboss/inthehouse", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("inthehouse", {my_user: user});
} else{
    res.redirect("/");
}
});


app.get("/round1/yourtheboss/lost", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("lost", {my_user: user});
} else{
    res.redirect("/");
}
});

app.get("/round1/yourtheboss/win", (req,res)=>{
    if (req.session && req.session.username) {
    user = req.session.username;
    res.render("win", {my_user: user});
} else{
    res.redirect("/");
}
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});