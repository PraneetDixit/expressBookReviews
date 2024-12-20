const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    const filteredUsers = users.filter((user) => user.username == username);
    return !(filteredUsers.length > 0);
};

const authenticatedUser = (username, password) => {
    //returns boolean
    const filteredUsers = users.filter(
        (user) => user.username == username && user.password == password
    );
    return filteredUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        // Store access token and username in session
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const filteredBook = books[isbn];
    let user = req.session.authorization.username;
    filteredBook.reviews[user] = review;
    books[isbn] = filteredBook;
    return res.send("Review updated");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];
  let user = req.session.authorization.username;
  delete filteredBook.reviews[user]
  books[isbn] = filteredBook;
  return res.send("Review deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
