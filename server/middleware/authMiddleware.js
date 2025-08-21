// Check if the user is logged in (using Passport.js)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();  // User is authenticated, continue to the next middleware/route
  }
  req.flash("error", "Please log in first.");
  return res.redirect("/login");  // Redirect to login if not authenticated
}

// Check if the logged-in user is authorized to access the resource
// This is typically used to verify if the user owns a resource like a profile
function isAuthorized(req, res, next) {
  if (req.user._id.toString() === req.params.id.toString()) {
    return next();  // User is authorized, continue to next middleware/route
  }
  req.flash("error", "You are not authorized to view this page.");
  return res.redirect(`/user/${req.user._id}`);  // Redirect to their own profile if not authorized
}

module.exports = {
  isLoggedIn,
  isAuthorized,
};
