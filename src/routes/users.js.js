const formidable = require('express-formidable');
const router = require('express').Router();
const { registerUser, verifyEmail, loginUser, logoutUser } = require('../controllers/users');

router.post('/register', formidable(), registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/logout', logoutUser);


module.exports = router;