const Audio = require("../models/audioSchema")
const cloudinary = require("cloudinary").v2

const createAudio = async (req, res) => {
    const { title, artist, category } = req.body;
    const {path} = req.file;
    const audio = await Audio.findOne({ title });
    const audioCloud= await cloudinary.uploader.upload(path,{resource_type: 'auto'});
    try {
        if (audio) {
            return res.status(400).json({
                mensaje: "El audio ya se encuentra creado",
                status: 400
            })
        }
        const newAudio = new Audio({
            title,
            artist,
            url: audioCloud.secure_url,
            duration: audioCloud.duration,
            category
        })
        await newAudio.save();
        return res.status(201).json({
            mensaje: "Audio creado correctamente",
            status: 201,
            newAudio
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}


const getAllAudios = async (req, res) => {

    const audios = await Audio.find().populate("category")

    try {
        if (!audios) {
            return res.status(404).json({
                mensaje: "No se encontraron los usuarios",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            audios
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