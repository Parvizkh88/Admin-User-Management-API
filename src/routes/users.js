const formidable = require('express-formidable');
const session = require('express-session');
const dev = require('../config');
const userRouter = require('express').Router();

const { registerUser, verifyEmail, loginUser,
    logoutUser, userProfile, deleteUser, updateUser, forgetPassword, resetPassword } = require('../controllers/users');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');

userRouter.use(session({
    name: 'user_session',
    secret: dev.app.sessionSecretKey || 'oi9hewgifwoyg_',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 6000 },
}))

userRouter.post('/register', upload.single('image'), registerUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', isLoggedOut, loginUser);
userRouter.get('/logout', isLoggedIn, logoutUser);
userRouter
    .route('/')
    .get(isLoggedIn, userProfile)
    .delete(isLoggedIn, deleteUser)
    .put(isLoggedIn, upload.single('image'), updateUser);
userRouter.post('/forget-password', isLoggedOut, forgetPassword);
userRouter.post('/reset-password', isLoggedOut, resetPassword);


module.exports = userRouter;