//import * as express from "express";
const express = require("express");
const { process_params } = require("express/lib/router");
const app = express();
const port = process.env.PORT || 3400;
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render("main");

})


app.get("/warmup", (req,res)=>{
    res.render("warm");
})

app.get("/round1", (req,res)=>{
    res.render("round1");
})

app.get("/round1/approach", (req,res)=>{
    res.render("approach");
})

app.get("/round1/alert", (req,res)=>{
    res.render("alert");
})

app.get("/round1/yourtheboss", (req,res)=>{
    res.render("yourtheboss");
})

app.get("/round1/yourtheboss/inthehouse", (req,res)=>{
    res.render("inthehouse");
})


app.get("/round1/yourtheboss/lost", (req,res)=>{
    res.render("lost");
})

app.get("/round1/yourtheboss/win", (req,res)=>{
    res.render("win");
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})