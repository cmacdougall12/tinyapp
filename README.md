# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs.

## Final Product

If you don't have an account. Click the "Create Account" button in the Navigation Bar

!["If you don't have an account. Click the "Create Account" button in the Navigation Bar"](https://raw.githubusercontent.com/cmacdougall12/tinyapp/7b170d4230c07ad81f7e3d6706c73105ce9215d7/docs/register.png)

If you already have an account. Click login and fill out your account information

!["If you already have an account. Click login and fill out your account information"](https://raw.githubusercontent.com/cmacdougall12/tinyapp/7b170d4230c07ad81f7e3d6706c73105ce9215d7/docs/login.png)

To create a short URL. Navigate to the "Create New URL" and enter a URL that you wanted shortened. Note: http:// needs to be included in order for the link to work

!["To create a short URL. Navigate to the "Create New URL" and enter a URL that you wanted shortened. Note: http:// needs to be included in order for the link to work"](https://raw.githubusercontent.com/cmacdougall12/tinyapp/7b170d4230c07ad81f7e3d6706c73105ce9215d7/docs/createShortURL.png)

When returning to "My URLs" there will be a new short URL to the appropriate address. Once you create the link you will be able to edit, delete, or follow the short URL you just created

!["When returning to "My URLs" there will be a new short URL to the appropriate address. Once you create the link you will be able to edit, delete, or follow the short URL you just created"](https://raw.githubusercontent.com/cmacdougall12/tinyapp/7b170d4230c07ad81f7e3d6706c73105ce9215d7/docs/urls.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Features to be added

- a counter column for each link, so it can be seen how many times that particular shortURL was accessed
- a date column for each link showing when the link was created
- Method Override
