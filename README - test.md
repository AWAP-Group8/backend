# User API Test Suite

This repository contains a test suite for the User API using Chai and Chai-HTTP. The tests cover user registration, login, and a protected route for deleting users.

## Prerequisites

Before running the tests, make sure you have the following dependencies installed:

- Node.js
- Chai
- Chai-HTTP

Install the dependencies using:

```bash
npm install
```

## Running the Tests

1. Start the server:

    ```bash
    npm start
    ```

2. Run the tests:

    ```bash
    npm test
    ```

## Test Descriptions

### User Registration

Endpoint: `/user/register`

- **Description:** Registers a new user.
- **Test Case:** The test sends a POST request to register a new user and expects a successful response.

### User Login

Endpoint: `/user/login`

- **Description:** Logs in with the registered user.
- **Test Case:** The test sends a GET request to log in with the registered user and expects a successful response. The authentication token is saved for use in testing protected routes.

### Delete User (Protected Route)

Endpoint: `/user/delete`

- **Description:** Deletes the user (protected route).
- **Test Case:** The test sends a POST request to delete the user, including the authentication token in the request header. Expects a successful response indicating successful deletion.

## Server Configuration

The tests assume that the server is running on port 8081. If your server is running on a different port, update the `server.listen` and requests accordingly in the test script (`test/user-api.test.js`).

## Closing the Server

The server is automatically closed after running the tests. The closure includes a delay of 1 second to ensure proper termination.