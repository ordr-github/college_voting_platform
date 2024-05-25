// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const dotenv = require("dotenv");

// Initialize Express app
const app = express();
dotenv.config();

const port = 5000;

// const username = process.env.MONGODB_USERNAME
// const password = process.env.MONGODB_PASSWORD

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use the session middleware
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(`mongodb+srv://venkatreddypadalanet:GaX81F2kp4hovbfq@cluster0.dkxowvs.mongodb.net/Voters`)

// Define a mongoose schema for the user
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^[\w-\.]+@gitam\.in$/, 'Please enter a valid email address ending with @gitam.in']
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Route for the Success page
app.get("/success", async (req, res) => {
  // Implement logic for Success page here
  res.send("Hello World");
});

// Route for signing out
app.get("/signout", (req, res) => {
  // Destroy the session and redirect to the Sign In page
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect('/');
  });
});

// Route for the Sign In page
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});
// Route for the Sign Up page
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Route for handling sign-in
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedInUser = await User.findOne({ email: email });

    if (loggedInUser && loggedInUser.password === password) {
      // Store the logged-in user in the session
      req.session.email = loggedInUser.email;
      // Redirect to the success page upon successful sign-in
      res.redirect('/success');
    } else {
      // Handle unsuccessful sign-in with client-side alert
      const errorMessage = "Invalid email or password. Please try again.";
      res.send(`<script>alert("${errorMessage}"); window.location.href = "/";</script>`);
    }
  } catch (err) {
    // Handle errors with client-side alert
    const errorMessage = "An unexpected error occurred. Please try again later.";
    res.send(`<script>alert("${errorMessage}"); window.location.href = "/";</script>`);
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // User already exists, handle accordingly with client-side alert
      const errorMessage = "Email already exists. Please choose a different email.";
      res.send(`<script>alert("${errorMessage}"); window.location.href = "/signup";</script>`);
    } else {
      // Create a new user
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      await newUser.save();
      res.redirect('/');
    }
  } catch (err) {
    // Handle errors with client-side alert
    const errorMessage = "An unexpected error occurred. Please try again later.";
    res.send(`<script>alert("${errorMessage}"); window.location.href = "/signup";</script>`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
