const express = require('express');
const router = express.Router({ mergeParams: true }); // important!
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const { isLoggedIn } = require('../middleware/authMiddleware');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/uploads/projects'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// ✅ GET: Show project list for user
router.get('/', isLoggedIn, async (req, res) => {
  const projects = await Project.find({ createdBy: req.params.id });
  res.render('users/projects', { projects, user: req.user });
});

// ✅ GET: New project form
router.get('/new', isLoggedIn, (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    req.flash("error", "Unauthorized");
    return res.redirect(`/user/${req.user._id}/projects`);
  }
  res.render('users/addProject', { user: req.user });
});

// ✅ POST: Create new project
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    req.flash("error", "Unauthorized");
    return res.redirect(`/user/${req.user._id}/projects`);
  }

  const { title, description, link } = req.body;
  let imageUrl = '';
  if (req.file) {
    imageUrl = `/uploads/projects/${req.file.filename}`;
  }

  const project = new Project({
    title,
    description,
    link,
    imageUrl,
    createdBy: req.user._id
  });

  await project.save();
  res.redirect(`/user/${req.user._id}/projects`);
});

module.exports = router;
