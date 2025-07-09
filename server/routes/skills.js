const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn} = require("../middleware/authMiddleware");

// Find matchable users
router.get("/matchable", isLoggedIn, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const skillsNeeded = currentUser.skillsWanted;

    // Find other users who offer any of the skills the current user wants
    const matchingUsers = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
      skillsOffered: { $in: skillsNeeded }
    });

    res.render("skills/matchable", {
      matchingUsers,
      currentUser
    });
  } catch (err) {
    console.error("Error finding matchable users:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/user/" + req.user._id);
  }
});

module.exports = router;