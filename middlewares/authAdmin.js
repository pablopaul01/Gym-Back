const passport = require('passport');

const authenticateAdmin = (req, res, next) => {
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
        if (user.role !== "admin") {
            return res.status(401).json({
                mensaje: "EL usuario no es administrador",
                status: 401
            })
        }
        req.user = user;
        next();
    })(req, res, next)
}

module.exports = authenticateAdmin;