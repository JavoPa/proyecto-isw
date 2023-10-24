"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

//**Controlador de becas */
const postulacionController = require("../controllers/postulacion.controller");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);



//Ruta para ver las becas y sus requisitos
router.get('/becas', postulacionController.getBecasPostulacion);

//Ruta para postular a una beca
router.post('/postular', archivoMiddleware.subir, postulacionController.createPostulacion);

// Exporta el enrutador
module.exports = router;
