const formidable = require('express-formidable');
const session = require('express-session');
const dev = require('../config');
const userRouter = require('express').Router();
const { registerUser, verifyEmail, loginUser,
    logoutUser, userProfile, deleteUser, updateUser } = require('../controllers/users');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

userRouter.use(session({
    name: 'user_session',
    secret: dev.app.sessionSecretKey || 'oi9hewgifwoyg_',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 6000 },
}))

userRouter.post('/register', formidable(), registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', isLoggedOut, loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/', isLoggedIn, userProfile);
userRouter.delete('/', isLoggedIn, deleteUser);
userRouter.put('/', isLoggedIn, formidable(), updateUser);


module.exports = userRouter;