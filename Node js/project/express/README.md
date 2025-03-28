# Express Project

This is a Node.js project built using the Express framework. It includes routing, middleware, and error handling for a web application.

## Features

- Serves static files from the `public` directory.
- Includes routes for `/`, `/users`, `/api/data`, and `/api/public`.
- Custom error handling middleware.


## Usage

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   - `http://localhost:3000/` for the home page.
   - `http://localhost:3000/api/data` for the API data route.
   - `http://localhost:3000/api/public` for public static files.

3. Explore the API using Postman:
   [Postman Documentation](https://documenter.getpostman.com/view/42769621/2sB2cPi4uS)

## Project Structure

```
express/
├── app.js                # Main application file
├── routes/
│   ├── index.js          # Route for the home pagee
│   ├── users.js          # Route for user-related endpoints
├── middlewares/
│   ├── errorHandler.js   # Custom error handling middleware
├── public/               # Static files
├── views/                # Jade templates
├── package.json          # Project metadata and dependencies
```

## Middleware

- **Logger**: Logs HTTP requests using `morgan`.
- **Body Parsers**: Parses JSON and URL-encoded payloads.
- **Error Handler**: Handles errors and sends appropriate responses.

