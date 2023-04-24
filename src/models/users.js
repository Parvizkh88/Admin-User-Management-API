const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'name is required'],
        minlength: [2, 'minimum length for name is 2 character'],
        maxlength: [100, 'maximum length for name is 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: ' Please enter a valid email!',
        },
    },
    password: {
        type: String,
        required: [true, 'user password is required'],
        min: 6,
    },
    image: {
        type: String,
        default: '../../public/images/users/Jordan.jpg',
    },
    phone: {
        type: String,
        required: [true, 'user phone is required'],
    },
    is_admin: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isBanned: {
        type: Number,
        default: 0,
    },
});

const User = model('Users', userSchema);
module.exports = User