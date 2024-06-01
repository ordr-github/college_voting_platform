<h1>Repository Name: College-Voting-Platform</h1>
<p>You can view this site at <a href="https://college-voting-platform.onrender.com/">Click here</a></p>

**Description:**
This repository contains the source code for a web-based voting system implemented using Node.js, Express, MongoDB, and EJS. The system allows users to sign up, sign in, vote for candidates, view voting results, and sign out.

**Installation:**
1. Clone the repository:
   ```
   git clone https://github.com/your-username/Voting-System.git
   ```

2. Navigate to the project directory:
   ```
   cd Voting-System
   ```

3. Install dependencies:
   ```
   npm install
   ```

**Configuration:**
1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:
   ```
   MONGODB_USERNAME=your_mongodb_username
   MONGODB_PASSWORD=your_mongodb_password
   SESSION_KEY=your_session_secret_key
   ```
   Replace `your_mongodb_username`, `your_mongodb_password`, and `your_session_secret_key` with your MongoDB username, password, and a secret key for session management respectively.

**Usage:**
1. Start the server:
   ```
   npm start or  node server.js
   ```
   This will start the server on port 5000 by default. You can change the port in the `index.js` file if needed.

**Routes:**
1. **GET /**: Renders the Sign In page.
2. **GET /signin**: Renders the Sign In page.
3. **POST /login**: Handles sign-in authentication.
4. **GET /signup**: Renders the Sign Up page.
5. **POST /signup**: Handles user registration.
6. **GET /success**: Renders the Success page after successful sign-in.
7. **GET /signout**: Destroys the session and redirects to the Sign In page.
8. **POST /vote**: Handles the voting process.
9. **GET /result**: Renders the page to display voting results.

**Directory Structure:**
- **public/**: Contains static assets like HTML and CSS files.
- **views/**: Contains EJS templates for rendering dynamic content.
- **models/**: Contains Mongoose models for user and vote schemas.

**Dependencies:**
- Express.js: Web application framework for Node.js.
- Mongoose: MongoDB object modeling for Node.js.
- Body-parser: Middleware for handling HTTP POST request data.
- Express-session: Session middleware for Express.
- dotenv: Loads environment variables from a `.env` file.
- bcrypt: Library for hashing passwords.

**Contributing:**
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```
   git commit -m "Description of your changes"
   ```
4. Push to your forked repository:
   ```
   git push origin feature-name
   ```
5. Create a pull request from your forked repository to the main repository.

6. Contributors :
      <ul>
         <li><a href="https://github.com/VenkatreddyPadala">Venkat Reddy Padala</a></li>
         <li><a href="https://github.com/pranayreddyambati">Pranay Reddy Ambati</a></li>
         <li><a href="https://github.com/ordr-github">Deepak Reddy Obulareddy</a></li>
         <li>Sravanthi Vani</li>
      </ul>


