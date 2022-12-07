const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const lodash = require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://namfrans:<>@firstclustler.jcmwvy5.mongodb.net/todoListDB", {useNewUrlParser: true});

const itemSchema = {
  name: {
    type:String,
    required: true
  }
}

const listSchema = {
  name: String,
  items: [itemSchema]
}

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const listItem1 = new Item({
  name:"Running"
});

const listItem2 = new Item({
  name:"Push ups"
});

app.get("/", (req, res)=>{
  var day = date();
  Item.find({}, (err, tasks) =>{
    if (err) {
      console.log("Not found!");
    }else{
      res.render("list", {
        listTitle: day,
        newTasks: tasks,
        listType:"Main"
      });
    }
  });
});

app.post("/delete", (req, res)=>{
  var itemToDelete = req.body.checkedItem;
  var listName = req.body.listName;
  if(listName == "Main"){
    Item.findOneAndRemove(itemToDelete, (err)=>{
      if (!err){
        console.log("Deletion successful!");
      }
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listName},{$pull: {items:{_id: itemToDelete}}}, (err, listFound)=>{
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }
});

app.get("/:listId", (req, res)=>{
  var parameter = lodash.capitalize(req.params.listId);
  const listItems = List({
    name:parameter,
    items:[listItem1, listItem2]
  });

  List.findOne({name:parameter}, (err, list)=>{
    if(!err){
      if(!list){
        listItems.save();
        res.redirect("/"+parameter);
      }else{
        res.render("list", {
          listTitle: parameter,
          newTasks: list.items,
          listType:parameter
        });
      }
    }
  });
});

app.get("/about", (req, res)=>{
  res.render("about");
});

app.post("/", (req, res) =>{
  let listType = lodash.capitalize(req.body.submitted);
  const todoItem = new Item({
    name:req.body.task
  });
  if(listType == "Main"){
    todoItem.save();
    res.redirect("/");
  }else{
    List.findOne({name:listType}, (err, listFound)=>{
      listFound.items.push(todoItem);
      listFound.save();
    });
    res.redirect("/"+listType);
  }
});
var port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, ()=>{
  console.log("Server running 3000");
});
