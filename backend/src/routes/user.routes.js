"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de usuarios */
const usuarioController = require("../controllers/user.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define las rutas para los usuarios
router.get("/", authorizationMiddleware.isAdmin, usuarioController.getUsers);
router.post("/", authorizationMiddleware.isAdmin, usuarioController.createUser);
router.get("/id/:id", authorizationMiddleware.isAdmin, usuarioController.getUserById);
router.put(
  "/:id",
  authorizationMiddleware.isAdmin,
  usuarioController.updateUser,
);
router.delete(
  "/:id",
  authorizationMiddleware.isAdmin,
  usuarioController.deleteUser,
);
//Ruta para ver el estado de postulacion de un postulante
router.get('/estado', usuarioController.getEstado);

// Configura Multer para manejar la subida de archivos
const multer = require('multer');
const storage = multer.memoryStorage(); // Puedes configurar el almacenamiento según tus necesidades
const upload = multer({ storage: storage });
//Ruta para apelar un estado de postulacion
router.post('/apelar', upload.single('archivoPDF'), usuarioController.createApelacion);


// Exporta el enrutador
module.exports = router;
