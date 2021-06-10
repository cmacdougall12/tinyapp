//IMPORT, SET and USE****************************************************
const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const { json } = require("body-parser");
const bcrypt = require("bcrypt");

//set the view engine to ejs
app.set("view engine", "ejs");

//middlewear
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    secret: "secret",
  })
);

//HELPER FUNCTIONS*******************************************************
const {
  checkUserEmail,
  urlsForUser,
  generateRandomString,
} = require("./helpers");

//CONSTANT VARIABLES*****************************************************

const PORT = 8080;

//delcare urlDatabase as a global variable so entire application can access values
const urlDatabase = {};

//store an create new users using object
const users = {};

//GET REQUESTS***********************************************************

//get / page
app.get("/", (req,res)=>{
  //redirect to urls page if logged in, login page if not
  if (!req.session.user_id) {
    return res
      .redirect("login")
  }
  res.redirect("/urls");
})
// get urls page
app.get("/urls", (req, res) => {
  const templateVars = {
    user: req.session.user_id,
  };

  if (req.session.user_id) {
    templateVars["urls"] = urlsForUser(req.session.user_id.id, urlDatabase);
  }

  res.render("urls_index", templateVars);
});

//get new urls page (reidirect to log-in page if not logged in)
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  const templateVars = { user: req.session.user_id };
  res.render("urls_new", templateVars);
});

//get register page
app.get("/register", (req, res) => {
  //redirect to urls page if already logged in as a user
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    urls: urlDatabase,
    user: req.session.user_id,
  };
  res.render("urls_register", templateVars);
});

//get login page
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls")
  }
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id],
  };
  res.render("urls_login", templateVars);
});

//get shortURL application page
app.get("/urls/:shortURL", (req, res) => {
  //check to see if link exists
  if (!urlDatabase[req.params.shortURL]){
    return res.status(403).send(`The short URL ${req.params.shortURL} does not exist. Please ensure correct short URL was entered.`)
  }
  //check to see if user owns link and is logged in
  let userID = req.session.user_id
  if(!req.session.user_id || userID["id"] !== urlDatabase[req.params.shortURL]["userID"]){
    return res.status(403).send(`The short URL ${req.params.shortURL} is owned by another user. Please ensure correct short URL was entered and you are logged in as the correct user.`)
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: req.session.user_id,
  };
  res.render("urls_show", templateVars);
});

//POST REQUESTS**********************************************************
//register new user
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).send("Please fill out all required fields");
  }
  if (checkUserEmail(req.body.email, users) !== undefined) {
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
    req.session.user_id = users[userId];
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
  if (currentUser === undefined) {
    return res
      .status(403)
      .send("User does not exist with email given, please create an account");
  }
  if (
    currentUser !== undefined &&
    bcrypt.compareSync(req.body.password, users[currentUser].password)
  ) {
    req.session.user_id = users[currentUser];
    return res.redirect("/urls");
  }
  if (
    currentUser !== undefined &&
    !bcrypt.compareSync(req.body.password, users[currentUser].password)
  ) {
    res.status(403).send("Incorrect password please try again");
  }
});

//logout of app
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

//add a new url
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res
      .status(403)
      .send("Can not create links, without logging into account");
  }
  let newShortURL = generateRandomString();
  let newLongURL = req.body.longURL;
  let userID = req.session.user_id;
  urlDatabase[newShortURL] = { longURL: newLongURL, userID: userID.id };
  res.redirect("/urls/" + newShortURL);
});

//delete an existing url
app.post("/urls/:shortURL/delete", (req, res) => {
  //users not logged in can not delete links
  if (!req.session.user_id) {
    return res
      .status(403)
      .send("Can not delete links, without logging into account");
  }
  //user deleting link needs to be the one who made the link
  let userID = req.session.user_id;
  if (userID["id"] === urlDatabase[req.params.shortURL]["userID"]) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect("/urls");
  }
});

//modify an existing url
app.post("/urls/:shortURL/update", (req, res) => {
  //users not logged in can not modify links
  if (!req.session.user_id) {
    return res
      .status(403)
      .send("Can not modify messages, without logging into account");
  }
  //user modifying link needs to be the one who made the link
  let newLongURL = req.body.newLongURL;
  let userID = req.session.user_id;
  if (userID["id"] === urlDatabase[req.params.shortURL]["userID"]) {
    urlDatabase[req.params.shortURL]["longURL"] = newLongURL;
    return res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
