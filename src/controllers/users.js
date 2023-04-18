const fs = require('fs');
const jwt = require('jsonwebtoken');

const { securePassword } = require("../helpers/bcryptPassword");
const User = require('../models/users.js');
const dev = require('../config');
const { sendEmailWithNodeMailer } = require('../helpers/email');


const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.fields;
        const { image } = req.files;

        if (!name || !email || !phone || !password) {
            return res.status(404).json({
                message: 'name, email, phone or password is missing '
            });
        }

        if (password.length < 6) {
            return res.status(404).json({
                message: 'minimum length for password is 6'
            });
        }

        if (image && image.size > 1000000) {
            return res.status(400).json({
                message: 'maximum size for image is 1mb'
            });
        }

        const isExist = await User.findOne({ email: email })
        if (isExist) {
            return res.status(400).json({
                message: 'user with this email already exists'
            });
        }

        const hashedPassword = await securePassword(password);

        // store the data 
        const token = jwt.sign(
            { name, email, phone, hashedPassword, image },
            dev.app.jwtSecretKey,
            { expiresIn: '20m' }
        );

        // prepare an email
        const emailData = {
            email,
            subject: "Account Activation Email",
            html: `
            <h2>Hello ${name}! </h2>
            <p>Please click here to <a href="${dev.app.clientUrl}/api/users/activate/
            ${token}" target="_blank">activate your account</a> </p>
            `,
        };

        await sendEmailWithNodeMailer(emailData);

        res.status(200).json({
            message: 'verification link has been sent to your email.',
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(404).json({
                message: 'token is missing',
            });
        }
        jwt.verify(token, dev.app.jwtSecretKey, async function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: 'token is expired',
                });
            }
            // decoded the data
            const { name, email, phone, hashedPassword, image } = decoded;
            // const { name } = decoded;
            // console.log(decoded);
            // console.log(name);
            const isExist = await User.findOne({ email: email })
            if (isExist) {
                return res.status(400).json({
                    message: 'user with this email already exists'
                });
            }

            // create the user without image
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                phone: phone
            })
            // create the user with image
            if (image) {
                newUser.image.data = fs.readFileSync(image.path);
                newUser.image.contentType = image.type;
            }
            // save the user
            const user = await newUser.save()
            if (!user) {
                res.status(400).json({
                    message: 'user was not created',
                });
            }
            res.status(200).json({
                message: 'user was created. ready to login',
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { registerUser, verifyEmail }