// middleware/authMiddleware.js

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please log in first.");
  return res.redirect("/login");
}

function isAuthorized(req, res, next) {
  if (req.user._id.toString() === req.params.id) return next();
  req.flash("error", "You are not authorized to view this page.");
  return res.redirect(`/user/${req.user._id}`);
}

module.exports = {
  isLoggedIn,
  isAuthorized,
};
