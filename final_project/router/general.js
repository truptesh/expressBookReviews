const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// register new user
public_users.post("/register", (req,res) => {
 const { username, password } = req.body

 if (username.trim() === "" || password.trim() === ""){
    return res.status(400).json({message: "username and password should not be empty"})
 }

let existUser = users.filter(user => user.username === username.trim())
if (existUser.length < 1){
    users.push({
        username,
        password,
    })
    return res.status(201).json({message: "user created successfully."})
} else {
    return res.status(409).json({message: "user already exist."})
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books})

  // ---------  for task 10 --------------
//   let allBooks = new Promise((resolve, reject) => {
//     resolve(books)
//   })
//   allBooks.then((data) => {
//     return res.status(200).json({data});
// }) 
// ------- end of task 10 ---------
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

// --------- for task 11 -------------
// let data = new Promise((resolve, reject) => {
//     Object.keys(books).forEach((book) => {
//         if(parseInt(book) === isbn){
//             Object.assign(bookByIsbn, structuredClone(books[book]))
//         }
//     })

//     if (Object.keys(bookByIsbn).length > 0) {
//         return resolve(bookByIsbn)
//     }

//     return reject(new Error("Book not found"))
//     })

//     data.then(resultBooks => {
//         return res.status(200).json({resultBooks})
//     })
//     .catch(err => {
//         return res.status(404).json({message: err.message}) 
//     })
    // ------------ end of task 11 --------------
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

  // -------- for task 12 -----------
//   const data = new Promise((resolve, reject) => {
//     for (let isbn in books){
//         if (books[isbn].author.toLowerCase() === author.trim()){
//             bookByAuthor[isbn] = structuredClone(books[isbn])
//         }
//       }
//       if (Object.keys(bookByAuthor).length > 0){
//         return resolve(bookByAuthor)
//       }
    
//     return reject(new Error("book not found"))
//   })

//   data.then(resultData => {
//     return res.status(200).json({resultData})
//   })
//   .catch(err => {
//     return res.status(404).json({message: err.message})
//   })
    // --------- end of task 12 ------------
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
