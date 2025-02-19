const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(200).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)
  let bookByIsbn = {}
 Object.keys(books).forEach((book) => {
    if(parseInt(book) === isbn){
        Object.assign(bookByIsbn, structuredClone(books[book]))
    }
 })
 if (Object.keys(bookByIsbn).length > 0) {
    return res.status(200).json({bookByIsbn});
} else {
    return res.status(404).json({message: "Book not found"})
}
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase()
  let bookByAuthor = {}
  for (let isbn in books){
    if (books[isbn].author.toLowerCase() === author.trim()){
        bookByAuthor[isbn] = structuredClone(books[isbn])
    }
  }
  if (Object.keys(bookByAuthor).length > 0){
    return res.status(200).json({bookByAuthor});
  } else {
    return res.status(404).json({message: "Book not found"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase()
  let bookByTitle = {}
  for (let isbn in books){
    let book = books[isbn].title.toLowerCase().split(',')
    if (book.length > 1){               // for filtering mutiple books
        for (bookIndex in book){
            if (book[bookIndex].trim() === title.trim()){
                let selectedBook =structuredClone(books[isbn])
                selectedBook.title = book[bookIndex]
                bookByTitle[isbn] = selectedBook
            }
        }
    } else {
        if (books[isbn].title.toLowerCase() === title.trim()){
            bookByTitle[isbn] = structuredClone(books[isbn])
        }
    }
  }
  if (Object.keys(bookByTitle).length > 0){
    return res.status(200).json({bookByTitle});
  } else {
    return res.status(404).json({message: "book not found"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)
  let reviewByIsbn = {}
  let reviewCout
  if (isbn in books){
    for (let id in books){
        if (parseInt(id) === isbn){
            reviewByIsbn = structuredClone(books[id])
            reviewCout = Object.keys(reviewByIsbn.reviews).length
            }   
      }
  } else{
      return res.status(404).json({message: "Enter valid ISBN"})
  }
  
  if (reviewCout > 0){
    return res.status(200).json({reviewByIsbn});
  } else {
    return res.status(404).json({message: "Not reviewed yet"})
  }
});

module.exports.general = public_users;
