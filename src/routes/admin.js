const formidable = require('express-formidable');
const session = require('express-session');
const adminRouter = require('express').Router();

const dev = require('../config');
const { loginAdmin, logoutAdmin, getAllUsers, deleteUserByAdmin } = require('../controllers/admin');
const { registerUser } = require('../controllers/users');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');
const { isAdmin } = require('../middlewares/isAdmin');

adminRouter.use(session({
    name: 'admin_session',
    secret: dev.app.sessionSecretKey || 'oi9hewgifwoyg_',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 6000 },
}));

adminRouter.post('/login', isLoggedOut, loginAdmin);
adminRouter.get('/logout', isLoggedIn, logoutAdmin);
adminRouter.post('/register', upload.single('image'), registerUser);
adminRouter.get('/dashboard', isLoggedIn, getAllUsers);
// adminRouter.put('/dashboard', isLoggedIn, updateUser);
adminRouter.delete('/dashboard/:id', isLoggedIn, isAdmin, deleteUserByAdmin);


module.exports = adminRouter;