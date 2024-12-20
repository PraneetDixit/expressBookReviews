const express = require("express");
let books = require("./booksdb.js");
const { JsonWebTokenError } = require("jsonwebtoken");
const { default: axios } = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// function alreadyRegistered(username) {
//     const filteredUsers = users.filter((user) => user.username == username);
//     return filteredUsers.length > 0;
// }

public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (username && password) {
        if (isValid(username)) {
          users.push({"username": username, "password":password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    } else {
        return res.status(404).json({ message: "Unable to register" });
    }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

public_users.get("/allBooks", async (req, res)=>{
  try{
    const response = await axios.get("http://localhost:5000/");
    res.send(JSON.stringify(response.data, null, 4));
  }catch (err){
    res.status(500).json({message: `Error fetching all books : ${err.message}`});
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const filteredBook = books[isbn];
    res.send(JSON.stringify(filteredBook, null, 4));
});

public_users.get("/booksByIsbn/:isbn", async (req, res)=>{
  const isbn = req.params.isbn;
  try{
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  }catch (err){
    res.status(500).json({message: `Error fetching book with isbn ${isbn} : ${err.message}`});
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    //Write your code here
    const author = req.params.author;
    const booksArray = Object.values(books);
    const filteredBook = booksArray.filter((book) => book.author == author);
    res.send(JSON.stringify(filteredBook, null, 4));
});

public_users.get("/booksByAuthor/:author", async (req, res)=>{
  const author = req.params.author;
  try{
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(JSON.stringify(response.data, null, 4));
  }catch (err){
    res.status(500).json({message: `Error fetching book by author ${author} : ${err.message}`});
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    //Write your code here
    const title = req.params.title;
    const booksArray = Object.values(books);
    const filteredBook = booksArray.filter((book) => book.title == title);
    res.send(JSON.stringify(filteredBook, null, 4));
});

public_users.get("/booksByTitle/:title", async (req, res)=>{
  const title = req.params.title;
  try{
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(JSON.stringify(response.data, null, 4));
  }catch (err){
    res.status(500).json({message: `Error fetching book with title ${title} : ${err.message}`});
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const filteredReviews = books[isbn].reviews;
    res.send(JSON.stringify(filteredReviews, null, 4));
});

module.exports.general = public_users;
