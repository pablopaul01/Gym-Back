const Programa = require("../models/programaSchema.js");

const createPrograma = async (req, res) => {
    const { name, price } = req.body;
    const programa = await Programa.findOne({ name });
    try {
        if (programa) {
            return res.status(400).json({
                mensaje: "El programa ya se encuentra creado",
                status: 400
            })
        }
        const newPrograma = new Programa({
            name,
            price
        })
        await newPrograma.save();
        return res.status(201).json({
            mensaje: "Programa creado correctamente",
            status: 201,
            newPrograma
        })
        
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}

const getAllProgramas = async (req, res) => {
    const programas = await Programa.find()
    try {
        if (!programas || programas.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron programas",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Programas encontrados",
            status: 201,
            programas
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getPrograma = async (req, res) => {
    const { id } = req.params;

    const programa = await Programa.findById(id);
    try {
        if (!programa) {
            return res.status(400).json({
                mensaje: "Programa no encontrado",
                status: 400
            })
        }
        return res.status(201).json({
            mensaje: "Programa encontrado",
            status: 201,
            programa
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const updatePrograma = async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body
    try {
        const programa = await Programa.findByIdAndUpdate(id,{
            name,
            price
        }, {new: true})

        if (!programa){
                return res.status(404).json({
                    mensaje: "Programa no encontrado",
                    status:404
                })
            }
        return res.status(200).json({
            mensaje: "Programa actualizado correctamente",
            status: 200,
            programa
        })
    } catch (error) {
        return  res.status(500).json({
            mensaje: "hubo un error, intentelo mas tarde fijate que onda",
            status: 500
        })
    }
}

const deletePrograma = async (req, res) => {
    const { id } = req.params;
    try {
        const programa = await Programa.findByIdAndDelete(id)
        if (!programa){
                return res.status(404).json({
                    mensaje: "Programa no encontrado",
                    status:404
                })
            }
        return res.status(200).json({
            mensaje: "Programa eliminado correctamente",
            status: 200,
            programa
        })
    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            mensaje: "hubo un error, intentelo mas tarde fijate que onda",
            status: 500
        })
    }
}

module.exports = {
    createPrograma,
    getAllProgramas,
    getPrograma,
    updatePrograma,
    deletePrograma
  }