const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
    fecha_de_pago: {
        type: Date,
        trim: true
    },
    monto: {
        type: Number,
        trim: true,
    },
    medio_de_pago: {
        type: String,
        trim: true,
    },
    comprobante: {
        type: String,
        trim: true
    },
    fecha_de_vencimiento: {
        type: Date,
        trim: true
    },
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumno",
        trim: true
    }
}, {timestamps : true});


const Pago = mongoose.model("Pago", pagoSchema);

module.exports = Pago;