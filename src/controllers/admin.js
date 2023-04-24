const fs = require('fs');
const jwt = require('jsonwebtoken');

const { securePassword, comparePassword } = require("../helpers/bcryptPassword");
const User = require('../models/users.js');
const dev = require('../config');
const { sendEmailWithNodeMailer } = require('../helpers/email');
const { errorResponse } = require('../helpers/responseHandler');


const loginAdmin = async (req, res) => {
    try {
        // we need to get email and password from req.body to login
        const { email, password } = req.body;
        if (!email || !password) {
            errorResponse(res, 400, 'email or password not found');
        }

        if (password.length < 6)
            errorResponse(res, 400, 'minimum length for password is 6');

        const foundUser = await User.findOne({ email: email })
        if (!foundUser)
            errorResponse(res, 400, 'user with this email does not exist. Please register first');

        // isAdmin - I want to check it before checking the password and comparing ...
        if (foundUser.is_admin === 0) {
            return res.status(400).json({
                message: 'Not an admin'
            });
        }

        const isPasswordMatched = await comparePassword(password, foundUser.password)

        if (!isPasswordMatched) {
            return res.status(400).json({
                message: 'email/password mismatched'
            });
        }
        // creating session
        req.session.userId = foundUser._id;

        res.status(200).json({
            user: {
                name: foundUser.name,
                email: foundUser.email,
                phone: foundUser.phone,
                image: foundUser.image,
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
//dashboard - Read all users except admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ is_admin: 0 })
        res.status(200).json({
            ok: true,
            message: 'returned all users',
            users: users,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const deleteUserByAdmin = async (req, res) => {
    try {
        // we have put id inside curly braces since we may have more parameters
        const { id } = req.params;
        const foundUser = await User.findById(id);
        if (!foundUser) errorResponse(res, 404, 'user not found with this id')

        // isAdmin or not
        await User.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            message: 'deleted user successfully',
        });
    } catch (error) {

    }
}

module.exports = {
    loginAdmin, logoutAdmin, getAllUsers, deleteUserByAdmin
}