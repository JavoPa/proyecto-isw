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

/** Middlewares de subida de archivos */
const archivoMiddleware = require("../middlewares/archivo.middleware.js");

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
router.get('/estado/', usuarioController.getEstado);

// Rutas para obtener (solo) postulantes y documentos de postulante segun id
router.get('/postulantes', authorizationMiddleware.isAdmin, usuarioController.getPostulantes);
router.get("/documentos/:id", authorizationMiddleware.isAdmin, usuarioController.getDocuments);

//Ruta para apelar un estado de postulacion
router.post('/apelar', archivoMiddleware.subir, usuarioController.createApelacion);


// Exporta el enrutador
module.exports = router;
