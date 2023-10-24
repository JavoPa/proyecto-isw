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
router.get("/", usuarioController.getUsers);
router.post("/", authorizationMiddleware.isAdmin, usuarioController.createUser);
router.get("/id/:id", usuarioController.getUserById);
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

//Ruta para ver las becas y sus requisitos
router.get('/becas', usuarioController.getBecasPostulacion);

//Ruta para postular a una beca
router.post('/postular', archivoMiddleware.subir, usuarioController.createPostulacion);

//Ruta para ver el estado de postulacion de un postulante
router.get('/estado', usuarioController.getEstado);

//Ruta para apelar un estado de postulacion
router.post('/apelar', archivoMiddleware.subir, usuarioController.createApelacion);


// Exporta el enrutador
module.exports = router;
