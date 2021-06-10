//generate random alphanumeric string of length 6. This is used when creating a new shortURL
const generateRandomString = function () {
  let result = "";
  result = Math.random().toString(36).substr(2, 6);
  return result;
};


//check registered users email to avoid duplicate accounts
const checkUserEmail = function (email, userObject) {
  for (user in userObject) {
    if (email === userObject[user].email) {
      return user;
    }
  }
  return undefined;
};


//returns URLs that belongs to the user logged in
const urlsForUser = function (id, urlDatabase) {
  const userURLS = {};
  for (let urls in urlDatabase) {
    if (urlDatabase[urls]["userID"] === id) {
      userURLS[urls] = urlDatabase[urls]["longURL"];
    }
  }
  return userURLS;
};

module.exports = {checkUserEmail, urlsForUser, generateRandomString};