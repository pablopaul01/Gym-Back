const router = require("express").Router();
const upload = require("../middlewares/multer")
const { register, getAllUsers, getUserById, deleteUser, login, userUpdate, addAudios, deleteAudio, recoverPass, resetPass } = require("../controllers/userController");
const { registerAlumno, getAllAlumnos, getAlumnoById, deleteAlumno, alumnoUpdate, asginPrograma, changeVencimiento, getAlumnosVencidosYPorVencer, getAlumnosPorVencer, getAlumnosVencidos, changeInicioCiclo} = require("../controllers/alumnoController");
// const authenticateAdmin = require("../middlewares/authAdmin");
// const authenticateUser = require("../middlewares/authUser");
const { createPrograma, getAllProgramas, getPrograma, updatePrograma, deletePrograma } = require("../controllers/programaController");
const { createPago, getAllpagos, delPago, updatePago } = require("../controllers/pagoController");
const { getPagosMensual, getPagosMensualPorMedio, getAlumnosStats } = require("../controllers/reportController");

// rutas de usuarios
router.get("/usuarios" ,getAllUsers);
router.get("/usuario/:id" , getUserById);
router.delete("/usuario/:id", deleteUser);
router.put("/usuario/:id", userUpdate);
router.post("/registrar", register);
router.post("/login", login);
// router.put("/admin/:id", changeToAdmin);
// router.put("/desactivar/usuario/:id", userDisabled);
router.post("/usuario/recuperar", recoverPass);
router.put("/usuario/reset/:id/:token", resetPass);

//rutas de alumnos
router.post("/alumno", registerAlumno);
router.get("/alumnos", getAllAlumnos);
router.get("/alumno/:id", getAlumnoById);
router.delete("/alumno/:id", deleteAlumno);
router.put("/alumno/:id", alumnoUpdate);
router.put("/alumno/programa/:id", asginPrograma);
router.put("/alumno/vencimiento/:id", changeVencimiento);
router.put("/alumno/inicioCiclo/:id", changeInicioCiclo);
router.get("/alumnos/vencimientos", getAlumnosPorVencer)
router.get("/alumnos/vencidos", getAlumnosVencidos)

//rutas de programas
router.post("/programa", createPrograma);
router.get("/programas", getAllProgramas);
router.get("/programa/:id", getPrograma);
router.put("/programa/:id", updatePrograma);
router.delete("/programa/:id", deletePrograma);

//rutas de pagos
router.post("/pago", upload.single("comprobante"), createPago);
router.get("/pagos", getAllpagos);
router.delete("/pago/:id/:pagoId", delPago);
router.put("/pago/:id", updatePago);


//rutas de reportes
router.get("/reporte/pagosMensual/:mes", getPagosMensual);
router.get("/reporte/pagosMensualPorMedio/:mes", getPagosMensualPorMedio);
router.get("/reporte/alumnosStats", getAlumnosStats)

module.exports = router; 