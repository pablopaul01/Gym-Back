const Pago = require('../models/pagoSchema');
const Alumno = require('../models/alumnoSchema');

const getPagosMensual = async (req, res) => {
    const { mes } = req.params;
console.log("el mes", mes)
    try {
        // Obtener el año actual
        const year = new Date().getFullYear();

        // Crear una fecha de inicio para el mes seleccionado
        const startOfMonth = new Date(year, mes - 1, 1);

        // Crear una fecha de fin para el mes seleccionado
        const endOfMonth = new Date(year, mes, 0, 23, 59, 59, 999);

        // Consultar los pagos realizados en el mes seleccionado
        const pagos = await Pago.find({
            fecha_de_pago: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        // Calcular la suma de los pagos
        const total = pagos.reduce((acc, pago) => acc + pago.monto, 0);

        return res.status(200).json({
            mensaje: `La suma de los pagos del mes ${mes} es de ${total}`,
            total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error, intente más tarde',
            error: error.message
        });
    }
};

const getPagosMensualPorMedio = async (req, res) => {
    const { mes } = req.params;

    try {
        // Obtener el año actual
        const year = new Date().getFullYear();

        // Crear una fecha de inicio para el mes seleccionado
        const startOfMonth = new Date(year, mes - 1, 1);

        // Crear una fecha de fin para el mes seleccionado
        const endOfMonth = new Date(year, mes, 0, 23, 59, 59, 999);

        // Consultar los pagos realizados en el mes seleccionado
        const pagos = await Pago.aggregate([
            {
                $match: {
                    fecha_de_pago: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: '$medio_de_pago',
                    total: { $sum: '$monto' }
                }
            }
        ]);

        return res.status(200).json({
            mensaje: `Suma de pagos del mes ${mes} por medio de pago`,
            pagosPorMedio: pagos
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error, intente más tarde',
            error: error.message
        });
    }
};

const getAlumnosStats = async (req, res) => {
    try {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Cantidad de alumnos registrados
        const totalAlumnos = await Alumno.countDocuments();


               // Cantidad de alumnos cuya fecha de próximo vencimiento es menor a la fecha actual
        const alumnosConVencimientoMayor = await Alumno.countDocuments({
            proximo_vencimiento: { $lt: fechaActual }
        })

        // Cantidad de alumnos cuya fecha de próximo vencimiento sea menores de 60 dias a la fecha actual, sumado a la cantidad de alumnos cuya fecha de vencimiento sen mayores a la fecha actual
        const fechaLimite = new Date(fechaActual);
        fechaLimite.setDate(fechaLimite.getDate() - 60);
        const alumnosActivosProximoVencimiento = await Alumno.countDocuments({
            proximo_vencimiento: { $gte: fechaLimite }
        });

        const hoy = new Date();
        const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        
        const cantidadAlumnosVencidosEnMesActual = await Alumno.countDocuments({
          proximo_vencimiento: {
            $gte: primerDiaDelMes,
            $lte: fechaActual,
          },
        });
        
        // Agregar el campo "clases" al filtro para contar la cantidad de alumnos por programa
        const alumnosPorPrograma = await Alumno.aggregate([
            { $group: { _id: "$clases", total: { $sum: 1 } } },
            { $lookup: { from: "programas", localField: "_id", foreignField: "_id", as: "programa" } },
            { $unwind: "$programa" },
            { $project: { _id: 0, nombrePrograma: "$programa.name", total: 1 } }
        ]);

        const alumnosActivosPorPrograma = await Alumno.aggregate([
            { $match: { proximo_vencimiento: { $gte: fechaLimite } } },
            { $group: { _id: "$clases", total: { $sum: 1 } } },
            { $lookup: { from: "programas", localField: "_id", foreignField: "_id", as: "programa" } },
            { $unwind: "$programa" },
            { $project: { _id: 0, nombrePrograma: "$programa.name", total: 1 } }
        ]);

        const alumnosVencidosPorPrograma = await Alumno.aggregate([
            { $match: { proximo_vencimiento: { $lt: fechaActual } } },
            { $group: { _id: "$clases", total: { $sum: 1 } } },
            { $lookup: { from: "programas", localField: "_id", foreignField: "_id", as: "programa" } },
            { $unwind: "$programa" },
            { $project: { _id: 0, nombrePrograma: "$programa.name", total: 1 } }
        ]);

        const alumnosVencidosMesActualPorPrograma = await Alumno.aggregate([
            { $match: { proximo_vencimiento: { $gte: primerDiaDelMes, $lte: fechaActual } } },
            { $group: { _id: "$clases", total: { $sum: 1 } } },
            { $lookup: { from: "programas", localField: "_id", foreignField: "_id", as: "programa" } },
            { $unwind: "$programa" },
            { $project: { _id: 0, nombrePrograma: "$programa.name", total: 1 } }
        ]);



        console.log(alumnosPorPrograma);

        return res.status(200).json({
            mensaje:"Se encontraron los datos de los alumnos",
            totalAlumnos,
            alumnosConVencimientoMayor,
            alumnosActivosProximoVencimiento,
            cantidadAlumnosVencidosEnMesActual,
            alumnosPorPrograma,
            alumnosActivosPorPrograma,
            alumnosVencidosPorPrograma,
            alumnosVencidosMesActualPorPrograma
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Hubo un error, intente más tarde',
            error: error.message
        });
    }
};


module.exports = {
    getPagosMensual,
    getPagosMensualPorMedio,
    getAlumnosStats
} 