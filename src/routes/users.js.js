const formidable = require('express-formidable');
const session = require('express-session');
const dev = require('../config');
const userRouter = require('express').Router();
const { registerUser, verifyEmail, loginUser,
    logoutUser, userProfile } = require('../controllers/users');

userRouter.use(session({
    name: 'user_session',
    secret: dev.app.sessionSecretKey || 'oi9hewgifwoyg_',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 60 },
}))

userRouter.post('/register', formidable(), registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/profile', isLoggedIn, userProfile);


module.exports = userRouter;