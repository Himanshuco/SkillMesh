const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// -------------------------------------------
// GET /signup – Render signup form
// -------------------------------------------
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// -------------------------------------------
// POST /signup – Register user and auto-login
// -------------------------------------------
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, userType, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "A user with that email already exists.");
      return res.redirect("/signup");
    }

    // Create and register user
    const newUser = new User({ username, email, userType });
    const registeredUser = await User.register(newUser, password);

    // Assign initial credits and timestamp
    registeredUser.credits = 30;
    registeredUser.lastCreditUpdate = new Date();
    await registeredUser.save();

    // Auto-login the user
    req.logIn(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome, ${registeredUser.username}`);
      res.redirect(`/user/${registeredUser._id}`);
    });
  } catch (e) {
    console.error("Signup error:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// -------------------------------------------
// GET /login – Render login form
// -------------------------------------------
router.get("/login", (req, res) => {
  res.render("users/login");
});

// -------------------------------------------
// POST /login – Authenticate user
// -------------------------------------------
router.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome back, ${user.username}`);
      res.redirect(`/user/${user._id}`);
    });
  })(req, res, next);
});

// -------------------------------------------
// POST /logout – Log user out
// -------------------------------------------
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/");
    }
    req.flash("success", "You have logged out successfully.");
    res.redirect("/login");
  });
});

module.exports = router;
