//import dependancies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { json } = require("body-parser");
const PORT = 8080;

//delcare urlDatabase as a global variable so entire application can access values
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//store an create new users using object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//set username to global variable so it is available throughout application
let = username = "";

//generate random alphanumeric string of length 6. This is used when creating a new shortURL
const generateRandomString = function () {
  let result = "";
  result = Math.random().toString(36).substr(2, 6);
  return result;
};

//set the view engine to ejs
app.set("view engine", "ejs");

//middlewear
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// get requests
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, users: users };
  res.render("urls_index", templateVars);
});

//get new url page
app.get("/urls/new", (req, res) => {
  const templateVars = { users: users };
  res.render("urls_new", templateVars);
});

//get register page
app.get("/register", (req, res) => {
  res.render("urls_register");
});

//get shortURL application page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users,
  };
  res.render("urls_show", templateVars);
});

//get shortURL link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//register new user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  users[id] = {
    id: id,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(users[id])
  console.log(users)
  res.cookie("user_id", users[id]);
  res.redirect("/urls");
});

//login to app
app.post("/login", (req, res) => {
  username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

//logout of app
app.post("/logout", (req, res) => {
  username = "";
  res.cookie("username", username);
  res.redirect("/urls");
});

//add a new url
app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  let newLongURL = req.body.longURL;
  urlDatabase[newShortURL] = newLongURL;
  res.redirect("/urls/" + newShortURL);
});

//delete an existing url
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//modify an existing url
app.post("/urls/:shortURL/update", (req, res) => {
  let newLongURL = req.body.newLongURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
