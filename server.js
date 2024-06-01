// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
// Initialize Express app
const app = express();
dotenv.config();

const port = 5000;

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use the session middleware
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs'); // Set EJS as the view engine
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.dkxowvs.mongodb.net/Voters`);

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
    },
    vote_validate: {
        type: Boolean,
        default: false
    }
});

const voteSchema = new mongoose.Schema({
    candidate: {
        type: String,
        required: true
    },
    year:{
      type: String,
      required: true
    },
    votecount: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
const Votes = mongoose.model('Votes', voteSchema);

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

app.get("/signin", (req, res) => {
  res.sendFile(__dirname + '/public/signin.html');
});

app.post("/vote", async (req, res) => {
  const candidateName = req.body.candidateName;

  try {
      const candidate = await Votes.findOne({ candidate: candidateName });

      if (candidate) {
          candidate.votecount++;
          await candidate.save();

          await User.updateOne({ email: req.session.email }, { vote_validate: true });

          res.redirect('/success');
      } else {
          res.status(404).send("Candidate not found");
      }
  } catch (err) {
      console.error("Error voting:", err);
      res.status(500).send("An unexpected error occurred");
    }
});

// Route to render result.ejs
app.get('/result', async (req, res) => {
  try {
    // Fetch all candidates and their vote counts from the database
    let candidates = await Votes.find({});

    // Sort candidates based on vote count in descending order
    candidates.sort((a, b) => b.votecount - a.votecount);

    // Render the result.ejs view and pass the sorted candidate data
    res.render('result', { candidates: candidates });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).send("An unexpected error occurred");
  }
});


let participantsData = [];

// Route for the Sign Up page
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Route for handling sign-in
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedInUser = await User.findOne({ email: email });

    if (loggedInUser) {
      // Compare hashed password
      const passwordMatch = await bcrypt.compare(password, loggedInUser.password);

      if (passwordMatch) {
        // Store the logged-in user in the session
        req.session.email = loggedInUser.email;
        // Redirect to the success page upon successful sign-in
        res.redirect('/success');
      } else {
        // Handle unsuccessful sign-in with client-side alert
        const errorMessage = "Invalid email or password. Please try again.";
        res.send(`<script>alert("${errorMessage}"); window.location.href = "/";</script>`);
      }
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
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Create a new user with hashed password
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        vote_validate: false
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

app.get("/success", async (req, res) => {
  try {
      const loggedInUser = await User.findOne({ email: req.session.email });
      const candidates = await Votes.find({});
      if (loggedInUser) {
          res.render('success', { user: loggedInUser, candidates: candidates });
      } else {
          res.status(404).send("User not found");
      }
  } catch (err) {
      console.error("Error fetching user information:", err);
      res.status(500).send("An unexpected error occurred");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
