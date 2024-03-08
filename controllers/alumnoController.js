const mongoose = require("mongoose");
const Alumno = require("../models/alumnoSchema.js");
const Programa = require("../models/programaSchema.js");

const getAllAlumnos = async (req, res) => {

    const alumnos = await Alumno.find().populate("pagos");

    try {
        if (!alumnos || alumnos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron usuarios",
                status: 404
            })
        }

        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            alumnos
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getAlumnoById = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({ _id: id }).populate("pagos");
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
    try {
        const alumno = await Alumno.findOne({ dni });
        if (alumno) {
            return res.status(400).json({
                mensaje: "El alumno ya se encuentra registrado",
                status: 400
            })
        }
        const fechaActual = new Date();
        const proximoVencimiento = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, fechaActual.getDate());
        const newAlumno = new Alumno({
            name,
            lastname,
            dni,
            whatsapp, 
            fecha_inicio_ciclo: Date.now(),
            //proximo vencimiento es data now + 30 dias
            proximo_vencimiento: proximoVencimiento
        })
        console.log(newAlumno);
        await newAlumno.save();
        return res.status(201).json({
            mensaje: "Alumno registrado correctamente",
            status: 201,
            newAlumno
        })
    } catch (error) {
        console.log("error:", error)
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
        if (!alumno) {
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
            mensaje: "Hubo un error, intente más tarde,here",
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
            lastname, 
            dni,
             whatsapp
        }, { new: true });
        return res.status(200).json({
            mensaje: "Alumno modificado correctamente",
            status: 200,
            // token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const asginPrograma = async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body
    console.log(programa);
    const alumno = await Alumno.findOne({ _id: id });
    try {
        if (!alumno) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado, emtrp aqui",
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
        alumno.clases = program._id;
        await alumno.save();
        return res.status(200).json({
            mensaje: "Programa asignado exitosamente",
            status: 200,
            alumno
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error
        })
    }
}

const removePrograma = async (req, res) => {
    const { id } = req.params;
    const { programa } = req.body

  try {
    const alumno = await Alumno.findOne({ _id: id });
    if (!alumno) {
      return res.status(404).json({
        mensaje: "Alumno no encontrado",
        status: 404
      });
    }
    if (!programa !== alumno.clases) {
      return res.status(404).json({
        mensaje: "Programa no encontrado",
        status: 404
      });
    }

    alumno.clases = null;

    await alumno.save();

    return res.status(200).json({
      mensaje: "Programa removido exitosamente",
      status: 200,
      alumno
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Hubo un error, intente más tarde",
      status: 500
    });
  }
}

const changeVencimiento = async (req, res) => {
    const { id } = req.params;
    const { vencimiento } = req.body
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del alumno no válido",
                status: 400
            })
        }
        const alumno = await Alumno.findByIdAndUpdate(id, {
            proximo_vencimiento: vencimiento
        }, { new: true });
        return res.status(200).json({
            mensaje: "Vencimiento modificado correctamente",
            status: 200,
            // token
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

module.exports = {
    registerAlumno,
    getAllAlumnos,
    getAlumnoById,
    deleteAlumno,
    alumnoUpdate,
    asginPrograma,
    changeVencimiento
}