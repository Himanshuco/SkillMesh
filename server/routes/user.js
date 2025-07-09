const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isLoggedIn, isAuthorized } = require("../middleware/authMiddleware");

router.get('/user/:id/projects', isLoggedIn, async (req, res) => {
  const userId = req.params.id;

  const projects = await Project.find({ createdBy: userId });
  res.render('users/projects', { projects, user: req.user });
});


// GET /user/:id - Show user's dashboard (private)
router.get("/:id", isLoggedIn, isAuthorized, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }
    res.render("users/dashboard", { user });
  } catch (err) {
    console.error("Error fetching user:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
});

// GET /user/:id/profile - Show public user profile (no login required)
router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }
    res.render("users/profile", { user });
  } catch (err) {
    console.error("Error loading profile:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
});

// GET /user/:id/edit - Show form to edit user profile (private)
router.get("/:id/edit", isLoggedIn, isAuthorized, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }
    res.render("users/edit", { user });
  } catch (err) {
    console.error("Error loading edit form:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
});

// PUT /user/:id - Update user info (private)
router.put("/:id", isLoggedIn, isAuthorized, async (req, res) => {
  try {
    const {
      username,
      email,
      userType,
      location,
      bio,
      avatarUrl,
      skillsOffered,
      skillsWanted
    } = req.body;

    // Prepare updated user data
    const updatedData = {
      username,
      email,
      userType,
      location,
      bio,
      avatarUrl,
      // Convert comma-separated strings to arrays, or empty arrays if undefined
      skillsOffered: skillsOffered ? skillsOffered.split(",").map(s => s.trim()) : [],
      skillsWanted: skillsWanted ? skillsWanted.split(",").map(s => s.trim()) : []
    };

    // Optionally update skillsOfferedCount to reflect length of skillsOffered array
    updatedData.skillsOfferedCount = updatedData.skillsOffered.length;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    req.flash("success", "Profile updated!");
    res.redirect(`/user/${updatedUser._id}`);
  } catch (err) {
    console.error("Error updating user:", err);
    req.flash("error", "Update failed.");
    res.redirect(`/user/${req.user._id}/projects`);
  }
});

module.exports = router;
