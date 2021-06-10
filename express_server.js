//import, set and use dependancies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { json } = require("body-parser");
const bcrypt = require("bcrypt");

//set the view engine to ejs
app.set("view engine", "ejs");

//middlewear
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//CONSTANT VARIABLES****************************************************************

const PORT = 8080;

//delcare urlDatabase as a global variable so entire application can access values
const urlDatabase = {};

//store an create new users using object
const users = {};

//FUNCTIONS*************************************************************************

//generate random alphanumeric string of length 6. This is used when creating a new shortURL
const generateRandomString = function () {
  let result = "";
  result = Math.random().toString(36).substr(2, 6);
  return result;
};

//check registered users email to avoid duplicate accounts
const checkUserEmail = function (email, userObject) {
  for (user in userObject) {
    if (email === users[user].email) {
      return user;
    }
  }
  return false;
};

//returns URLs that belongs to the user logged in
const urlsForUser = function (id) {
  const userURLS = {};
  for (let urls in urlDatabase) {
    if (urlDatabase[urls]["userID"] === id) {
      userURLS[urls] = urlDatabase[urls]["longURL"];
    }
  }
  return userURLS;
};

//GET REQUESTS**********************************************************************
// get urls page
app.get("/urls", (req, res) => {
  const templateVars = {
    user: req.cookies["user_id"],
  };

  if (req.cookies["user_id"]) {
    templateVars["urls"] = urlsForUser(req.cookies["user_id"].id);
  }

  res.render("urls_index", templateVars);
});

//get new urls page (reidirect to log-in page if not logged in)
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.redirect("/login");
  }
  const templateVars = { user: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});

//get register page
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies["user_id"],
  };
  res.render("urls_register", templateVars);
});

//get login page
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_login", templateVars);
});

//get shortURL application page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

//POST REQUESTS*********************************************************************
//register new user
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("Please fill out all required fields");
  }
  if (checkUserEmail(req.body.email, users) !== false) {
    return res
      .status(400)
      .send("Email already registered, please login or use a different email");
  }
  if (res.statusCode !== 400) {
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    res.cookie("user_id", users[userId]);
    res.redirect("/urls");
  }
});

//login to app
app.post("/login", (req, res) => {
  const currentUser = checkUserEmail(req.body.email, users);
  //blank fields
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("Please fill out all required fields");
  }
  //check user object for email given and see if passwords match
  if (currentUser === false) {
    return res
      .status(403)
      .send("User does not exist with email given, please create an account");
  }
  if (
    currentUser !== false &&
    bcrypt.compareSync(req.body.password, users[currentUser].password)
  ) {
    return res.cookie("user_id", users[currentUser]).redirect("/urls");
  }
  if (
    currentUser !== false &&
    bcrypt.compareSync(req.body.password, users[currentUser].password)
  ) {
    res.status(403).send("Incorrect password please try again");
  }
});

//logout of app
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//add a new url
app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  let newLongURL = req.body.longURL;
  let userID = req.cookies["user_id"];
  urlDatabase[newShortURL] = { longURL: newLongURL, userID: userID.id };
  res.redirect("/urls/" + newShortURL);
});

//delete an existing url
app.post("/urls/:shortURL/delete", (req, res) => {
  //users not logged in can not delete links
  if (!req.cookies["user_id"]) {
    return res
      .status(403)
      .send("Can not delete links, without logging into account");
  }
  //user deleting link needs to be the one who made the link
  let userID = req.cookies["user_id"];
  if (userID["id"] === urlDatabase[req.params.shortURL]["userID"]) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect("/urls");
  }
});

//modify an existing url
app.post("/urls/:shortURL/update", (req, res) => {
  //users not logged in can not modify links
  if (!req.cookies["user_id"]) {
    return res
      .status(403)
      .send("Can not modify messages, without logging into account");
  }
  //user modifying link needs to be the one who made the link
  let newLongURL = req.body.newLongURL;
  let userID = req.cookies["user_id"];
  if (userID["id"] === urlDatabase[req.params.shortURL]["userID"]) {
    urlDatabase[req.params.shortURL]["longURL"] = newLongURL;
    return res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
