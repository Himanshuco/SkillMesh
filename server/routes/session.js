const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/authMiddleware');
const methodOverride = require('method-override');

// Method override for PUT/DELETE from forms
router.use(methodOverride('_method'));

// GET: Show form to create a new session
router.get('/sessions/new', isLoggedIn, async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id);
    const students = await User.find({ skillsWanted: { $in: teacher.skillsOffered } });

    res.render('sessions/new', {
      teacher,
      students,
      messages: {
        error: req.flash('error'),
        success: req.flash('success'),
      },
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching data.');
    res.redirect('/sessions/new');
  }
});

// POST: Create a new session
router.post('/sessions', isLoggedIn, async (req, res) => {
  const { skillId, learnerId, scheduledAt } = req.body;
  try {
    const teacher = req.user;
    const learner = await User.findById(learnerId);

    if (!learner) {
      req.flash('error', 'Learner not found');
      return res.redirect('/sessions/new');
    }

    if (!teacher.skillsOffered.includes(skillId)) {
      req.flash('error', 'You do not offer this skill');
      return res.redirect('/sessions/new');
    }

    const session = new Session({
      skill: skillId,
      teacher: teacher._id,
      learner: learner._id,
      scheduledAt,
      creditsTransferred: 0,
    });

    await session.save();
    req.flash('success', 'Session created successfully');
    res.redirect('/sessions');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating session');
    res.redirect('/sessions/new');
  }
});

// GET: View all sessions (both as teacher and learner)
router.get('/sessions', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      $or: [{ teacher: userId }, { learner: userId }],
    })
      .populate('skill')
      .populate('teacher')
      .populate('learner');

    res.render('sessions/index', { sessions, user: req.user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching sessions.');
    res.redirect('/sessions');
  }
});

// GET: View a specific session's details
router.get('/sessions/:id', isLoggedIn, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await Session.findById(sessionId)
      .populate('skill')
      .populate('teacher')
      .populate('learner');

    if (!session) {
      req.flash('error', 'Session not found.');
      return res.redirect('/sessions');
    }

    res.render('sessions/view', { session });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching session.');
    res.redirect('/sessions');
  }
});

// POST: Complete a session (by the student)
router.post('/sessions/:id/complete', isLoggedIn, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('teacher learner');

    if (!session) {
      req.flash('error', 'Session not found.');
      return res.redirect('/sessions');
    }

    if (session.learner._id.toString() !== req.user._id.toString()) {
      req.flash('error', 'Only the learner can mark the session as completed.');
      return res.redirect(`/sessions/${session._id}`);
    }

    const now = new Date();
    if (new Date(session.scheduledAt) > now) {
      req.flash('error', 'Session cannot be completed yet.');
      return res.redirect(`/sessions/${session._id}`);
    }

    session.status = 'completed';
    session.creditsTransferred = 20;
    session.teacher.credits += 20;
    session.learner.credits -= 10;

    await session.teacher.updateCredits({ teacherCredits: 20 });
    await session.learner.updateCredits({ learnerCredits: 10 });

    await session.save();
    await session.teacher.save();
    await session.learner.save();

    req.flash('success', 'Session completed and credits transferred.');
    res.redirect(`/sessions/${session._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error completing session.');
    res.redirect('/sessions');
  }
});

// PUT: Update session details
router.put('/sessions/:id', isLoggedIn, async (req, res) => {
  try {
    const { skillId, learnerId, scheduledAt } = req.body;
    const sessionId = req.params.id;

    const updatedSession = {
      skill: skillId,
      learner: learnerId,
      scheduledAt,
    };

    const session = await Session.findByIdAndUpdate(sessionId, updatedSession, { new: true });

    if (!session) {
      req.flash('error', 'Session not found.');
      return res.redirect('/sessions');
    }

    req.flash('success', 'Session updated successfully.');
    res.redirect(`/sessions/${sessionId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating session.');
    res.redirect('/sessions');
  }
});

// POST: Delete a session
router.post('/sessions/:id/delete', isLoggedIn, async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await Session.findByIdAndDelete(sessionId);

    if (!session) {
      req.flash('error', 'Session not found.');
      return res.redirect('/sessions');
    }

    req.flash('success', 'Session deleted successfully.');
    res.redirect('/sessions');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting session.');
    res.redirect('/sessions');
  }
});

//16/08
router.get('/sessions/:id/video', isLoggedIn, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('teacher learner skill');
    if (!session) {
      req.flash('error', 'Session not found');
      return res.redirect('/sessions');
    }
    res.render('sessions/video', { session });
  } catch (err) {
    req.flash('error', 'Something went wrong');
    res.redirect('/sessions');
  }
});

module.exports = router;
