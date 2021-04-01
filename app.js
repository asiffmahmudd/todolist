const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const app = express();

var items = ["Buy food", "Cook food", "Eat food"];
var workItems = [];

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extented:true}));
app.use(express.static("public"));

app.get('/', function(req, res){

    let day = date.getDate();
    res.render("list", {listTitle: day, newItems:items});
    
});

app.get('/work', function(req,res){
    res.render("list", {listTitle:"Work List", newItems:workItems})
});

app.get('/about', function(req, res){
    res.render('about');
});

app.post("/", function(req, res){
    var item = req.body.item;
    if(item){
        if(req.body.list === "Work List"){
            workItems.push(item);
            res.redirect('/work');
        }
        else{
            items.push(item);
            res.redirect('/');
        }
    }
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });