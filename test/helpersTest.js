const { assert } = require("chai");

const {
  checkUserEmail,
  generateRandomString,
  urlsForUser,
} = require("../helpers.js");

//checkUserEmail function test*********************************************

const testUsers = {
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

describe("checkUserEmail", function () {
  it("should return a user with valid email", function () {
    const user = checkUserEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });

  it("should return a false if there is no valid email", function () {
    const user = checkUserEmail("cam@example.com", testUsers);
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});

//generateRandomString function test*********************************************
describe("generateRandomString", function () {
  it("Should return string of random letters and numbers", function () {
    const random = generateRandomString();
    assert.strictEqual(random.length, 6);
  });
});

// urlsForUser function test*********************************************
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lU" },
};

describe("urlsForUser", function () {
  it("should return object with only links belonging to userID:aJ48lW ", function () {
    const urlsFiltered = urlsForUser("aJ48lW",urlDatabase)["b6UTxQ"];
    const expected ="https://www.tsn.ca"
  
    assert.equal(urlsFiltered, expected);
  });

  it("should return empty object as no user matching exists. No links associated to user so result should be undefined", function () {
    const urlsFiltered = urlsForUser("aJ4dsdsd",urlDatabase)["b6UTxQ"];
    const expected = undefined
  
    assert.equal(urlsFiltered, expected);
  });


  
});
