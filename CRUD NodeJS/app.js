//Variables
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { engine } = require("express-handlebars");
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3307
});
sql.query("use nodejs");
app.use('/img', express.static('img'));

//Template engine
app.engine('handlebars',engine());
app.set('view engine','handlebars');

//Routes and Templates
app.get("/",function(req,res){
    /*res.send("Essa é a minhha página inicial!");*/
    /*res.sendFile(__dirname+"/index.html");*/
    /*console.log(req.params.id);*/
    res.render('index');
});
app.get("/javascript", function(req,res){res.sendFile(__dirname+'/js/javascript.js');});
app.get("/style", function(req,res){res.sendFile(__dirname+'/css/style.css');});
app.get("/inserir", function(req,res){res.render("inserir");});
app.get("/select/:id?", function(req,res){
    if(!req.params.id){
        sql.query("select *from user order by id asc", function(err, results,fields){
            res.render('select',{data:results});
        });
    }else{
        sql.query("select *from user where id=? order by id asc", [req.params.id], function( results){
            res.render('select',{data:results});
        }); 
    }
});
app.post("/controllerForm", urlencodeParser, function(req,res){
    sql.query("insert into user values (?,?,?)",[req.body.id, req.body.name, req.body.age]);
    res.render('controllerForm', {name: req.body.name});
});

app.get('/deletar/:id', function(req,res){
    sql.query("delete from user where id=?", [req.params.id]);
    res.render('deletar');
});

app.get("/update/:id",function(req,res){
   sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
       res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
   });
});


app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
   res.render('controllerUpdate');
});

app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
    });
 });
 
 
 app.post("/controllerUpdate",urlencodeParser,function(req,res){
    sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
    res.render('controllerUpdate');
 });

//Start Server
app.listen(3000,function(req,res){console.log('Servidor está rodando');});

