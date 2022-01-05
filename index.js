//import * as express from "express";

const express = require("express");
const querystring = require("querystring");
var session = require('express-session');
const AWS = require('aws-sdk');
const { process_params } = require("express/lib/router");
const { URLSearchParams } = require("url");
const app = express();
const port = process.env.PORT || 8000;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

AWS.config.loadFromPath('./credentials.json');

let docClient = new AWS.DynamoDB.DocumentClient();

app.post("/create", (req, res) =>{
    let body = req.body;
    console.log(body);
    let input = {
        "email": body.email,
        "password": body.password,
        
    };
    let params = {
        TableName: body.TableName,
        Item: input
    };
    docClient.put(params, function(err, data){

        if(err){
            console.log("users::save::error - " + JSON.stringify(err, null, 2));
            res.status(404).send("Oops! User is not saved in dynamoDB")

        } else {
            console.log("users::save::success");
            res.status(200).send("Great! User saved in dynamoDB")
        }
    });

});

app.get("/read", async (req,res) =>{
    let params ={
        TableName: "new_data"
    }

    //const data = await docClient.scan(params).promise();
    const data = await docClient.scan(params).promise().catch(err =>{
        console.log(err);
        res.status(400).send(err);
    });
    console.log(data);
    res.status(200).send(data);
})

app.get("/read/:id", (req, res) =>{
    let body = req.body;

    let params = {
        TableName: "new_data",
        Key: {
            "email": req.params.id
        }
    };
    docClient.get(params, function(err, data){

        if(err){
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
            res.status(404).send("No Values Found")

        } else {
            console.log("users::fetchOneByKey::success - "+ JSON.stringify(data, null, 2));
            res.status(200).send(data)
        }
    });

});

app.post("/update", (req, res) =>{
    const body = req.body;

    let params = {
        TableName: body.TableName,
        Key: { "email": body.email },
        UpdateExpression: "set password = :byPassword",
        ExpressionAttributeValues:{
            ":byPassword": body.password,
        },

        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function(err, data){

        if(err){
            console.log("users::update::error - " + JSON.stringify(err, null, 2));
            res.status(404).send("Oops! Not Updated")

        } else {
            console.log("users::update::success" + JSON.stringify(data));
            res.status(200).send(data)
        }
    });

});


app.delete("/delete", (req,res)=>{
    let params = {
        TableName: "new_data",
        Key: {
            "email": body.email,

        }
    };

    docClient.delete(params, function(err, data){
        if(err){
            console.log("users::save::error - " + JSON.stringify(err, null, 2));
            res.status(404).send("Oops! User is not deleted")

        } else {
            console.log("users::save::success");
            res.status(200).send("Great! User is deleted")
        }
    });

});


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
    req.session.destroy(() => {
        console.log("user reset");
    })

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
    res.redirect("/signout");
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


const auth = (req,res,next) =>{
    if (req.session && req.session.username) {
    console.log("this is the first pistop");
    next();
    }else {
        res.redirect("/?reason=invalid_login");
    }
}

const mw = (req,res, next)=>{
    console.log("first mw")
    next();
}
const m2 = (req,res, next)=>{
    console.log("second mw")
    next();
}
const middlewares = [mw, m2,auth];

app.get("/*", middlewares);


app.get("/signout", (req,res)=> {

    req.session.destroy(() => {
        res.render("signout");
    });

});

// const pitstop2 = (req,res,next) =>{
//     res.end("end here");
//     console.log("this is the second pistop");
//     next();
// 
app.get("/warmup", (req,res)=>{
    // if (req.session && req.session.username) {
    user = req.session.username;
    res.render("warm", {my_user: user});
    location = "warm";
/* } else{
    // res.redirect("/");
}*/
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

app.get("/signup", (req,res)=> {

    res.render("signup", { title: 'Signup Page'}); 
    
 }); 


app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});