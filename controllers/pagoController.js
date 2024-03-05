const Pago = require('../models/pagoSchema');
const Alumno = require('../models/alumnoSchema');
const cloudinary = require("cloudinary").v2

const createPago = async (req, res) => {
    const { fecha, monto, medio, alumno } = req.body;
    if (req.file){

        const  { path } = req.file;
    }
    const alumnoFind = await Alumno.findById(alumno);
    
    try {
        if (!alumnoFind) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            })
        }
        if (!req.file) {
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                medio_de_pago: medio,
                alumno,
            })
            //la fecha de vencimiento es alumnoFind.proximo_vencimiento + 30 dias   
            let fecha_de_vencimiento= new Date(alumnoFind.proximo_vencimiento);
            fecha_de_vencimiento.setDate(fecha_de_vencimiento.getDate() + 30);
            alumnoFind.proximo_vencimiento = fecha_de_vencimiento.toISOString();
            alumnoFind.ultimo_pago = newPago._id;
            await alumnoFind.save();
            await newPago.save();
            return res.status(201).json({
                mensaje: "Pago registrado correctamente",
                status: 201,
                newPago
            })
        }
        else{
            let fecha_de_vencimiento= new Date(alumnoFind.proximo_vencimiento);
            fecha_de_vencimiento.setDate(fecha_de_vencimiento.getDate() + 30);
            alumnoFind.proximo_vencimiento = fecha_de_vencimiento.toISOString();
            const comprobanteCloud= await cloudinary.uploader.upload( req.file.path );
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                comprobante: comprobanteCloud.secure_url,
                medio_de_pago: medio,
                alumno,
            })
            alumnoFind.ultimo_pago = newPago._id;
            await alumnoFind.save();
            await newPago.save();
            return res.status(201).json({
                mensaje: "Pago registrado correctamente",
                status: 201,
                newPago
            })
        }
    } catch (error) {
        console.log("error:", error)
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}


const getAllpagos = async (req, res) => {

    const pagos = await Pago.find()

    try {
        if (!pagos || pagos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron pagos",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Pagos encontrados exitosamente",
            status: 201,
            pagos
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const delPago= async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar el audio por ID
        const pago = await Pago.findById(id);
        if (!pago) {
            return res.status(404).json({
                mensaje: 'El pago no existe',
                status: 404
            });
        }
        // Obtener el public_id de Cloudinary desde la URL del audio
        const publicId = pago.comprobante.split('/').pop().split('.')[0];
        // Eliminar el archivo de Cloudinary
        await cloudinary.uploader.destroy(publicId)
        .then(result=>console.log(result));
        // Utilizar findByIdAndDelete para activar los middleware
        pago.deleteOne();
        return res.status(200).json({
            mensaje: 'Pago eliminado correctamente',
            status: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error, intente más tarde',
            status: 500,
            error: error.message
        });
    }
};


const updateAudio = async (req, res) => {
    const { id } = req.params;
    const { title, artist, category } = req.body;
    try {
        // Buscar el audio por ID
        const audio = await Audio.findById(id);

        if (!audio) {
            return res.status(404).json({
                mensaje: 'El audio no existe',
                status: 404
            });
        }

        // Actualizar los datos del audio
        audio.title = title || audio.title;
        audio.artist = artist || audio.artist;
        audio.category = category || audio.category;

        // Guardar los cambios en la base de datos
        const updatedAudio = await audio.save();

        return res.status(200).json({
            mensaje: 'Audio actualizado correctamente',
            status: 200,
            updatedAudio
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error, intente más tarde',
            status: 500,
            error: error.message
        });
    }
};

module.exports = {
    createPago,
    getAllpagos,
    delPago,
    updateAudio
  }