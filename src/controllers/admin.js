const fs = require('fs');
const jwt = require('jsonwebtoken');

const { securePassword, comparePassword } = require("../helpers/bcryptPassword");
const User = require('../models/users.js');
const dev = require('../config');
const { sendEmailWithNodeMailer } = require('../helpers/email');


const loginAdmin = async (req, res) => {
    try {
        // we need to get email and password from req.body to login
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                message: 'emailor password is missing '
            });
        }

        if (password.length < 6) {
            return res.status(404).json({
                message: 'minimum length for password is 6'
            });
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                message: 'user with this email does not exist. Please register first'
            });
        }
        // isAdmin - I want to check it before checking the password and comparing ...
        if (user.is_admin === 0) {
            return res.status(400).json({
                message: 'Not an admin'
            });
        }

        const isPasswordMatched = await comparePassword(password, user.password)

        if (!isPasswordMatched) {
            return res.status(400).json({
                message: 'email/password mismatched'
            });
        }
        // creating session
        req.session.userId = user._id;

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            },
            message: 'login successful',
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const logoutAdmin = (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('admin_session');
        res.status(200).json({
            ok: true,
            message: 'logout successful',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

module.exports = {
    loginAdmin, logoutAdmin
}