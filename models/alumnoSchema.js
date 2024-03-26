const mongoose = require("mongoose");

const alumnoSchema = new mongoose.Schema({ 
    name: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    dni: {
        type: Number,
        trim: true,
        required: true
    },
    whatsapp: {
        type: Number,
        require: true
    },
    obraSocial:{
        type: String,
        required: true
    },
    clases: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Programa",
        trim: true
    },
    fecha_inicio_ciclo: {
        type: Date,
        required: true
    },
    pagos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pago",
        trim: true
    }],
    proximo_vencimiento: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Alumno = mongoose.model("Alumno", alumnoSchema);

module.exports = Alumno;