const isLoggedIn = (req, res, next) => {
    console.log(req.session);
    try {
        if (req.session.userId) {
            next();
        } else {
            return res.status(400).json({
                message: 'please login!'
            })
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { isLoggedIn };