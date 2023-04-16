const registerUser = (req, res) => {
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
            console.log('image condition');
            return res.status(400).json({
                message: 'maximum size for image is 1mb'
            });
        }

        res.status(201).json({
            message: 'user is created'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
module.exports = { registerUser }