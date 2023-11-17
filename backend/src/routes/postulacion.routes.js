"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

//**Controlador de becas */
const postulacionController = require("../controllers/postulacion.controller.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

/** Middlewares de subida de archivos */
const archivoMiddleware = require("../middlewares/archivo.middleware.js");

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);



//Ruta para ver las becas y sus requisitos
router.get('/becas', postulacionController.getBecasPostulacion);

//Ruta para postular a una beca
router.post('/postular', archivoMiddleware.subirArray, postulacionController.createPostulacion);

//Ruta para ver el estado de postulacion de un postulante
router.get('/estado', postulacionController.getEstado);

//Ruta para apelar un estado de postulacion
router.post('/apelar', archivoMiddleware.subirMultiples, postulacionController.createApelacion);

// Exporta el enrutador
module.exports = router;
