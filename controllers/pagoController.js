const Pago = require('../models/pagoSchema');
const Alumno = require('../models/alumnoSchema');
const cloudinary = require("cloudinary").v2

const createPago = async (req, res) => {
    const { fecha, monto, medio, alumno } = req.body;
    const {path} = req.file;
    const alumnoFind = await Alumno.findById(alumno);
    
    try {
        if (!path) {
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                medio_de_pago: medio,
                alumno,
            })
            //la fecha de vencimiento es alumnoFind.proximo_vencimiento + 30 dias   
            const fecha_de_vencimiento= alumnoFind.proximo_vencimiento + 30 * 24 * 60 * 6;
            alumnoFind.proximo_vencimiento = fecha_de_vencimiento;
            alumnoFind.ultimo_pago = newPago._id;
        }
        else{

            const comprobanteCloud= await cloudinary.uploader.upload(path,{resource_type: 'auto'});
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                comprobante: audioCloud.secure_url,
                //la fecha de vencimiento es fecha + 30 dias
                fecha_de_vencimiento: new Date(fecha.getTime() + 30 * 24 * 60 * 6),
                medio_de_pago: medio,
                alumno,
            })
        }
        //cuando se guarda el pago debo guardar en alumnoSchema.js el id del pago que se acaba de registrar en el campo ultimo_pago
        const alumno = await Alumno.findById(alumno);
        alumno.ultimo_pago = newPago._id;
        await alumno.save();
        await newPago.save();
        return res.status(201).json({
            mensaje: "Pago registrado correctamente",
            status: 201,
            newPago
        })
    } catch (error) {
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
        if (!pagos) {
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

const delAudio = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar el audio por ID
        const audio = await Audio.findById(id);
        if (!audio) {
            return res.status(404).json({
                mensaje: 'El audio no existe',
                status: 404
            });
        }
        // Obtener el public_id de Cloudinary desde la URL del audio
        const publicId = audio.url.split('/').pop().split('.')[0];
        // Eliminar el archivo de Cloudinary
        await cloudinary.uploader.destroy(publicId, {resource_type: 'video'})
        .then(result=>console.log(result));
        // Utilizar findByIdAndDelete para activar los middleware
        audio.deleteOne();
        return res.status(200).json({
            mensaje: 'Audio eliminado correctamente',
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
    createAudio,
    getAllAudios,
    delAudio,
    updateAudio
  }