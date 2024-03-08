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
            let vencimiento_anterior = new Date(alumnoFind.proximo_vencimiento);
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                medio_de_pago: medio,
                alumno,
                vencimiento_anterior: vencimiento_anterior.toISOString(),
            })
            
            // la fecha de vencimiento es el mismo día del mes siguiente
            let fecha_de_vencimiento = new Date(alumnoFind.proximo_vencimiento);
            fecha_de_vencimiento.setMonth(fecha_de_vencimiento.getMonth() + 1);
            alumnoFind.proximo_vencimiento = fecha_de_vencimiento.toISOString();
            alumnoFind.pagos.push(newPago._id);
            await alumnoFind.save();
            await newPago.save();
            return res.status(201).json({
                mensaje: "Pago registrado correctamente",
                status: 201,
                newPago
            })
        }
        else{
            let vencimiento_anterior = new Date(alumnoFind.proximo_vencimiento);
            let fecha_de_vencimiento = new Date(alumnoFind.proximo_vencimiento);
            fecha_de_vencimiento.setMonth(fecha_de_vencimiento.getMonth() + 1);
            alumnoFind.proximo_vencimiento = fecha_de_vencimiento.toISOString();
            const comprobanteCloud= await cloudinary.uploader.upload( req.file.path );
            const newPago = new Pago({
                fecha_de_pago: fecha,
                monto,
                comprobante: comprobanteCloud.secure_url,
                medio_de_pago: medio,
                alumno,
                vencimiento_anterior: vencimiento_anterior.toISOString(),
            })
            alumnoFind.pagos.push(newPago._id);
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



const delPago = async (req, res) => {
    const { id } = req.params;
    try {
        // Buscar el pago por ID
        const pago = await Pago.findById(id);
        if (!pago) {
            return res.status(404).json({
                mensaje: 'El pago no existe',
                status: 404
            });
        }
        // Obtener el alumno asociado al pago
        const alumno = await Alumno.findOne({ pagos: id });
        if (!alumno) {
            return res.status(404).json({
                mensaje: 'El alumno asociado al pago no existe',
                status: 404
            });
        }
        // Eliminar el pago del array de pagos del alumno
        alumno.pagos = alumno.pagos.filter(p => p.toString() !== id);
        // Obtener el último pago del alumno
        const ultimoPago = alumno.pagos[alumno.pagos.length - 1];
        // Actualizar el proximo_vencimiento del alumno
        const vencimiento = await Pago.findById(ultimoPago);
        alumno.proximo_vencimiento = vencimiento ? vencimiento.vencimiento_anterior : null;
        // Guardar los cambios en el alumno
        await alumno.save();
        // Obtener el public_id de Cloudinary desde la URL del comprobante
        const publicId = pago.comprobante.split('/').pop().split('.')[0];
        // Eliminar el comprobante de Cloudinary
        await cloudinary.uploader.destroy(publicId);
        // Eliminar el pago de la base de datos
        await pago.deleteOne();
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