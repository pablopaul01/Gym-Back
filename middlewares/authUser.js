const passport = require('passport');

const authenticateUser = (req, res, next) => {
    passport.authenticate("jwt", (err, user, info) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al autenticar el usuario",
                status: 500
            })
        }
        if (!user) {
            return res.status(404).json({
                mensaje: "EL usuario no está logeado o no fue encontrado",
                status: 404
            })
        }
        req.user = user;
        next();
    })(req, res, next)
}

module.exports = authenticateUser;