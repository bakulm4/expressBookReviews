
const express = require('express');

const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
 const found_user = users.find(user=> user.username=== username && user.password === password);
 return (typeof users.find(user=> user.username=== username && user.password === password) !== 'undefined');
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Please provide both username and password fields"});
  }
  if(authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password or if user is registered. "});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const reviewer = req.session.authorization['username'];
  if(book){
    if(book[reviewer]){
      res.status(200).json({message:`Review replaced for  "${book.title}" by username "${reviewer}"`});
    }else{
      res.status(200).json({message:`Review added for "${book.title}" by username "${reviewer}"`});
    }
    book[reviewer] = req.query.review;
  } else
   return res.status(404).json({message: "There is no book with that ISBN."});
});

//Delete a book review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const book = books[req.params.isbn];
  const reviewer = req.session.authorization['username'];
  if(book){
    if(book[reviewer]){
      delete book[reviewer];
      res.status(200).json({message:`Deleted review for  "${book.title}" by username "${reviewer}"`});
    }else{
      res.status(200).json({message:`There were no reviews for "${book.title}" by username "${reviewer}" to delete`});
    }
  }
  else
   return res.status(404).json({message: "There is no book with that ISBN."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
