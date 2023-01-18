
const axios = require('axios');
const {promises :{readFile}} = require('fs');const express = require('express');
//let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const book_path='/books.json';

//Return the full URL of the request.
function getURL(request){
  return `${request.protocol}://${request.headers['host']}${request.originalUrl}`;
}

async function getBookList(request){
  const book_list_url = `${request.protocol}://${request.headers['host']}${book_path}`
  const bookListJson = await axios.get(book_list_url);
  return bookListJson.data;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(! users.find(user=> user.username=== username && user.password === password)){
             users.push({
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
 public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const bookList = await getBookList(req);
    return res.status(200).json({books: bookList});
  }catch (error){
    return res.status(500).json({message:error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  //const book = books[req.params.isbn];
  try{
    const bookList = await getBookList(req);
    const found_book=bookList[req.params.isbn];
  if(found_book)
   return res.status(200).json({book:JSON.stringify(found_book, null,4)});
  else
    return res.status(404).json({message:'Sorry the book with that ISBN number was not found'});
  }catch(error){
    console.log(error);
    return res.status(500).json({message:error.message});
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const bookList = await getBookList(req);
    const book = Object.values(bookList).find(value=>value.author === req.params.author);
    if(book)
     return res.send(JSON.stringify(book, null,4));
    else
      return res.status(404).json({message:'Sorry the book with that author was not found'});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
   const bookList = await getBookList(req);
    const book = Object.values(bookList).find(value=>value.title === req.params.title);
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
