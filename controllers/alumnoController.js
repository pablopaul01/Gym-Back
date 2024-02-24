const mongoose = require("mongoose");
const Alumno = require("../models/alumnoSchema.js");
const Programa = require("../models/programaSchema.js");

const getAllAlumnos = async (req, res) => {

    const alumno = await Alumno.find()

    try {
        if (!alumno) {
            return res.status(404).json({
                mensaje: "No se encontraron los usuarios",
                status: 404
            })
        }

        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            alumno
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getAlumnoById = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({ _id: id });
    try {
        if (!alumno) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado",
                status: 404,
            });
        }
        return res.status(200).json({
            mensaje: "Alumno encontrado exitosamente",
            status: 200,
            alumno,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        });
    }
};

const registerAlumno = async (req, res) => {
    const { name, lastname,dni, whatsapp } = req.body;
    const alumno = await Alumno.findOne({ dni });
    try {
        if (alumno) {
            return res.status(400).json({
                mensaje: "El alumno ya se encuentra registrado",
                status: 400
            })
        }
        const newAlumno = new Alumno({
            name,
            lastname,
            dni,
            whatsapp
        })
        await newAlumno.save();
        return res.status(201).json({
            mensaje: "Alumno registrado correctamente",
            status: 201,
            newAlumno
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde. entro por aqui",
            status: 500,
            error
        })
    }
}

const deleteAlumno = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findByIdAndDelete(id);

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del alumno no válido",
                status: 400
            })
        }
        if (!user) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado",
                status: 404
            })
        }
        return res.status(200).json({
            mensaje: "Alumno eliminado correctamente",
            status: 200,
            alumno
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const alumnoUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, dni, whatsapp } = req.body
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del alumno no válido",
                status: 400
            })
        }
        const alumno = await Alumno.findByIdAndUpdate(id, {
            ...req.body,
            name,
            lastname, dni, whatsapp
        }, { new: true });
        return res.status(200).json({
            mensaje: "Alumno modificado correctamente",
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

const asginPrograma = async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body
    const alumno = await Alumno.findOne({ _id: id });
    try {
        if (!alumno) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado",
                status: 404
            })
        }
        const program = await Programa.findOne({ _id: programa });
        if (!program) {
            return res.status(404).json({
                mensaje: "Programa no encontrado",
                status: 404
            })
        }
        alumno.programa = program._id;
        await alumno.save();
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error
        })
    }
}

module.exports = {
    registerAlumno,
    getAllAlumnos,
    getAlumnoById,
    deleteAlumno,
    alumnoUpdate,
    asginPrograma
}