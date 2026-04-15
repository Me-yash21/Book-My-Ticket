# Book My Ticket

Book My Ticket is a movie ticket booking API built with Node.js, Express and PostgreSQL. I used node-postgres (pg) library as postgres client for Node.js, Not any ORM.
 This application allows users to view and book cinema seats, ensuring no double-booking via SQL transactions in the database. The app was extended with a user authentication layer: only registered (logged-in) users can book seats.  User passwords are hashed with bcrypt , and JSON Web Tokens (JWTs) are used for login. In application refreshtoken and accesstoken are used.

## Setup and Installation

1. **Clone the repository** and install dependencies:
   ```bash
   git clone https://github.com/Me-yash21/Book-My-Ticket.git
   cd Book-My-Ticket
   npm install
   ```

2. **Configure the database**. I used a Dockerized PostgreSQL. In a `.env` file or Docker environment, set variables such as:
   - `POSTGRES_USER`, `POSTGRES_PASSWORD` (as required by the official Postgres image).
   - Also set `JWT_SECRET` (a random string) for both refresh and accesstoken for signing tokens.
    
    Run docker compose file 
   ```bash
   docker compose up -d
   ```
   OR
   ```bash
   npm run db:up
   ```
   This initializes a Postgres container with the given credentials.

3. **Initialize the database schema.**  After the Postgres container is running, create the required tables. The starter code’s comments show an example for the `seats` and seeding 20 rows. For example, in psql or a SQL client, run:
   ```sql
   CREATE TABLE seats (
     id SERIAL PRIMARY KEY,
     user_id INT REFERENCES 
     user(id) on DELETE NULL,
     isbooked INT DEFAULT 0
   );
   INSERT INTO seats (isbooked)
     SELECT 0 FROM generate_series(1, 20);
   ```
   Also create a `users` table for authentication, e.g.:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     email VARCHAR(255) NOT NULL,
     ....
   );
   ```
   (I used the 'SQLTOOLS' Vscode Extenction to create these table or run the sql query.)

4. **Run the server**. Start the app with:
   ```bash
   npm run dev
   ```
   It will listen on the port defined (default 8080). The server connects to your Postgres database and serves the endpoints below.

## Authentication Routes

This project adds user signup/login using JWTs:

- **POST /register:**  Creates a new user. The request body should include a name, email and password. The password is hashed with bcrypt before storing in the `users` table. Example: 
  ```json
  // POST api/v1/user/register
  { "name": "alice", "email":"alice@test.com", "password": "mysecretpass" }
  ```
  Response on success: `{ "message": "User registered successfully" }`.

- **POST /login :**  Logs in an existing user. Send the username and password; the server looks up the user, compares the hashed password with `bcrypt.compare`, and if valid it generates a JWT. For example:
  ```json
  // POST api/v1/user/login
  { "email": "alice@test.com", "password": "mysecretpass" }
  ```

- **POST /logout :**  logout the logged-in user. It is secure route, only logged-in or authenticate user can logout. for this i user `authenticate` middlerware.

- **POST /refresh :**  if user's accessToken got expired, client(frontend) call this route, it generate new accesstoken and refreshToken. and save the new refreshToken in database and set refreshtoken & accesstoken in cookie.

- **POST /verify/:token :**  This route verify the user email with token which send to the user's email while registering the user. it matched the comming rawtoken with hased tokend saved in database, and if matched set isverified true. 

- **POST /forgot-password :**  It takes email in body, and sends the rawToken to the user's email with link and saved the hashed token in the database. 

- **POST /reset-password/:token :** It takes the newPassword in req body. when token matched with users reset_password_token then change the user password. 

## Seats Routes


- **GET /seats/all** – Public endpoint (no auth required) that returns a JSON list of all seats and their status. For example:
  ```json
  [ { "id": 1, "name": "", "isbooked": 0 }, ... ]
  ```
  This uses `pool.query("SELECT * FROM seats")` internally.

- **PUT /seats/book/:id**  (protected) – Books a seat by its ID. This route is secured by the JWT-authentication middleware. Internally, the server performs a SQL transaction to safely check and update the seat. For instance, the code uses `SELECT ... FOR UPDATE` and `UPDATE seats SET isbooked = 1` within a transaction to avoid double-booking. If the seat is already booked, it returns an error like `{ "error": "Seat already booked" }`. otherwise it marks the seat booked by the user.
(In the starter code this was a 'PUT' on `/:id/:name`, but you can adapt it to use the logged-in user's info instead of a name parameter.)

Each protected route uses an Express middleware (e.g. `authenticate`) that checks the JWT. If no valid token is present, the middleware sends a 401 error.

This middleware is applied to the booking route so that only authenticated users can proceed.

