const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const registered_users = [];
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(! registered_users.find(user=> user.username=== username && user.password === password)){
            registered_users.push({
                'username':username,
                'password':password
            });
            return res.status(200).json({message: "User successfully registred."});
        }
        else
        return res.status(404).json({message: "User already exists!"});
            
    }
    else
      return res.status(404).json({message: "Unable to register user. Please provide both username and password"});
      //Write your code here
 });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(book)
   return res.send(JSON.stringify(book, null,4));
  else
    return res.status(404).json({message:'Sorry the book with that ISBN number was not found'});
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const book = Object.values(books).find(value=>value.author === req.params.author);
    if(book)
     return res.send(JSON.stringify(book, null,4));
    else
      return res.status(404).json({message:'Sorry the book with that author was not found'});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const book = Object.values(books).find(value=>value.title === req.params.title);
    if(book)
     return res.send(JSON.stringify(book, null,4));
    else
      return res.status(404).json({message:'Sorry the book with that title was not found'});
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(book)
   return res.send(JSON.stringify(book.reviews, null,4));
  else
    return res.status(404).json({message:'Sorry the book with that ISBN number was not found'});
});

module.exports.general = public_users;
