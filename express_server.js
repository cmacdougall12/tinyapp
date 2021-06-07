const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function(){
  let result = '';
  result = Math.random().toString(36).substr(2,6); 
  return result;
}

generateRandomString();

//set the view engine to ejs
app.set("view engine", "ejs");

//middlewear
app.use(bodyParser.urlencoded({extended:true}));



app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req,res)=> {
  console.log(req.body);
  res.send("ok");
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
