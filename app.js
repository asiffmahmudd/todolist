const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const app = express();

require('dotenv').config()

// var items = ["Buy food", "Cook food", "Eat food"];
var workItems = [];

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extented:true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3ov0.mongodb.net/todoListDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const itemSchema = {
    name: {
        type: String,
        required: true
    }
}

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to todolist"
})
const item2 = new Item({
    name: "Hit + to add a new item"
})
const item3 = new Item({
    name: "<-- hit this to delete an item"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
}
const List = mongoose.model("List", listSchema)



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