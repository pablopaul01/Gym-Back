const mongoose = require("mongoose");
const User = require("../models/userSchema.js");
const { encryptPassword, comparePassword } = require("../utils/passwordHandler.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {

    const users = await User.find()

    try {
        if (!users) {
            return res.status(404).json({
                mensaje: "No se encontraron los usuarios",
                status: 404
            })
        }

        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            users
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    try {

        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404,
            });
        }
        return res.status(200).json({
            mensaje: "Usuario encontrado exitosamente",
            status: 200,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        });
    }
};

const register = async (req, res) => {

    const { name, lastname, password, email } = req.body;

    const user = await User.findOne({ email });

    try {
        if (user) {
            return res.status(400).json({
                mensaje: "El usuario ya se encuentra registrado",
                status: 400
            })
        }
        const newUser = new User({
            name,
            lastname,
            password: encryptPassword(password),
            email
        })
        await newUser.save();
        return res.status(201).json({
            mensaje: "Usuario creado correctamente",
            status: 201,
            newUser
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde.",
            status: 500,
            error
        })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del usuario no válido",
                status: 400
            })
        }
        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            })
        }
        return res.status(200).json({
            mensaje: "Usuario eliminado correctamente",
            status: 200,
            user
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const secret = process.env.JWT_SECRET;

    try {
        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            })
        }
        if (user.state === false) {
            return res.status(404).json({
                mensaje: "El usuario tiene la cuenta suspendida",
                status: 404
            })
        }
        if (!comparePassword(password, user.password)) {
            return res.status(400).json({
                mensaje: "La contraseña es incorrecta",
                status: 400
            })
        }
        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
        }
        const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });
        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            status: 200,
            token
        })
    } catch (error) {
       
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}


const userUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, password } = req.body
    const secret = process.env.JWT_SECRET;

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del usuario no válido",
                status: 400
            })
        }

        if (req.body.password) {
            const user = await User.findByIdAndUpdate(id, {
                ...req.body,
                name,
                lastname,
                password: encryptPassword(password)
            }, { new: true });

            if (!user) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado",
                    status: 404
                })
            }
            const payload = {
                sub: user._id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
            }

            const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });

            return res.status(200).json({
                mensaje: "Usuario modificado correctamente",
                status: 200,
                token
            })
        }

        const user = await User.findByIdAndUpdate(id, {
            ...req.body,
            name,
            lastname
        }, { new: true });

        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname
        }

        const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });

        return res.status(200).json({
            mensaje: "Usuario modificado correctamente",
            status: 200,
            token
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const recoverPass = async (req, res) => {   
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            mensaje: "El usuario no existe",
            status: 404
        });
    }
    const token = jwt.sign({
        id: user._id
    }, "jwt_secret_key", {expiresIn: "1d"});

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port:587,
        auth: {
          user: 'gimansiamilitarlomas@gmail.com',
          pass: 'hngvevaoyzoqswjg'
        }
      });
      
      var mailOptions = {
        from: 'gimansiamilitarlomas@gmail.com',
        to: `${user.email}`,
        subject: 'Reestablecer contraseña GML',
        text: `Para reestablecer la contraseña haga click en el siguente enlace: https://gimnasiamilitarlomas.netlify.app/reset_password/${user._id}/${encodeURIComponent(token)}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          return res.send({Status: "Success"})
        }
      });

}

const resetPass = async (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            User.findByIdAndUpdate({_id: id}, {password: encryptPassword(password)})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
        }
    })
}

module.exports = {
    register,
    getAllUsers,
    getUserById,
    deleteUser,
    login,
    userUpdate,
    recoverPass,
    resetPass
}