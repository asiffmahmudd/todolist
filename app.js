const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname+"/date.js");
const mongoose = require("mongoose")
const app = express();
const _ = require('lodash')

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
    // let day = date.getDate();

    Item.find({}, function(err, items){
        if(err){
            console.log(err)
        }
        else if(items.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Saved successfully")
                }
            })
            res.redirect("/")
        }
        else{
            res.render("list", {listTitle: "Today", newItems:items});
        }
    })
    
});

// app.get('/work', function(req,res){
//     res.render("list", {listTitle:"Work List", newItems:workItems})
// });

app.get("/:newPage", function(req,res){
    const newList = _.capitalize(req.params.newPage)
    List.findOne({name: newList}, function(err, foundList){
        if(!err){
            if(foundList){
                res.render("list", {listTitle: foundList.name, newItems:foundList.items});
            }
            else{
                const list = new List({
                    name: newList,
                    items: defaultItems
                })
                list.save()
                res.redirect("/"+newList);
            }
        }
    })
})

// app.get('/about', function(req, res){
//     res.render('about');
// });

app.post("/", function(req, res){
    const value = req.body.item;
    const listName = req.body.list

    if(value){
        const item = new Item({
            name: value
        })

        if(listName === "Today"){
            item.save()
            res.redirect('/');
        }
        else{
            List.findOne({name: listName}, function(err, foundList){
                foundList.items.push(item)
                foundList.save()
                res.redirect("/"+listName)
            })
        }
    }
    else{
        res.status(500).send("Please enter a value")
    }

    // if(item){
    //     if(req.body.list === "Work List"){
    //         workItems.push(item);
    //         res.redirect('/work');
    //     }
    //     else{
    //         items.push(item);
    //         res.redirect('/');
    //     }
    // }
})

app.post("/delete", function(req,res){
    const itemId = req.body.item
    const listName = req.body.listName
    
    if(listName === "Today"){
        Item.findByIdAndRemove(itemId, function(err){
            if(err){
                console.log(err)
            }
            else{
                res.redirect('/')
            }
        })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: itemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+listName)
            }
        })
    }
    
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });