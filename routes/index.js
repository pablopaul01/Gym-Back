const router = require("express").Router();
const upload = require("../middlewares/multer")
const { register, getAllUsers, getUserById, deleteUser, login, userUpdate, changeToAdmin, userDisabled, addAudios, deleteAudio, recoverPass, resetPass } = require("../controllers/userController");
const { registerAlumno, getAllAlumnos} = require("../controllers/alumnoController");
const authenticateAdmin = require("../middlewares/authAdmin");
const authenticateUser = require("../middlewares/authUser");

// router.post("/", upload.single("audio"),authenticateAdmin, createAudio);
// router.delete("/:id",authenticateAdmin, delAudio);
// router.get("/" ,getAllAudios);
// router.put("/:id",upload.none(),authenticateAdmin, updateAudio);

// router.post("/category",upload.none(), authenticateAdmin, createCategory);
// router.get("/categories", getAllCategories);
// router.put("/category/:id", updateCategory);
// router.delete("/category/:id",authenticateAdmin, deleteCategory);

//rutas de usuarios
// router.get("/usuarios",authenticateAdmin ,getAllUsers);
// router.get("/usuario/:id" , getUserById);
// router.delete("/usuario/:id",authenticateAdmin , deleteUser);
// router.put("/usuario/:id",authenticateUser , userUpdate);
// router.post("/registrar",authenticateAdmin , register);
// router.post("/login", login);
// router.put("/admin/:id", authenticateAdmin, changeToAdmin);
// router.put("/desactivar/usuario/:id",authenticateAdmin, userDisabled);
// router.post("/usuario/recuperar", recoverPass);
// router.put("/usuario/reset/:id/:token", resetPass);

//rutas de alumnos
router.post("/alumno", registerAlumno);
router.get("/alumnos", getAllAlumnos);

// router.post("/usuario/audios/:id",authenticateAdmin ,addAudios);
// router.put("/usuario/audios/:id",authenticateAdmin ,deleteAudio);


module.exports = router; 