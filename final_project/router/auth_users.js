const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let existUser = users.filter(user => user.username === username.trim())
return existUser.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const existUser = users.filter(user => user.username === username.trim() && user.password === password.trim())
return existUser.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body

  if (username.trim() === "" || password.trim() === ""){
    return res.status(400).json({message: "username and password should be not empty"})
  }

  if (isValid(username)){
    if (authenticatedUser(username, password)){
        const accessToken = jwt.sign({data: username}, "JWTsecret", {expiresIn: 60 * 60})
        req.session.authorization = {accessToken, username}
        return res.status(200).json({message: "user successfullt logged in."})
    } else {
        return res.status(403).json({message: "password must be correct"})
    }
  } else {
    return res.status(409).json({message: "user not found, please register first"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn)
    const review = req.query.review

    try{
        if (isbn in books){
            books[isbn].reviews[req.user] = review
            return res.status(200).json({message: "book's review has been modified", ReviewedBooks: books})
        } else {
            return res.status(404).json({message: "book not found"})
        }
    } catch (err) {
        return res.status(404).json({message: err.message})
    }        
});

// delete book review by isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn)
    if (isbn in books){
        delete books[isbn].reviews[req.user]
        return res.status(200).json({message: "review has been deleted successfully", result: books})
    } else {
        return res.status(400).json({message: "enter valid isbn"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
