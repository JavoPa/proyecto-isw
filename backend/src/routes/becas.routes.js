"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

//**Controlador de becas */
const BecasController = require("../controllers/becas.controller");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define rutas para las becas
router.get('/', BecasController.getBecas);
router.post('/',authorizationMiddleware.isAdmin, BecasController.createBeca);
router.get('/:id', BecasController.getBecasid);
router.put('/:id', authorizationMiddleware.isAdmin, BecasController.updateBeca);
router.delete('/:id', authorizationMiddleware.isAdmin, BecasController.BorrarBeca);

// Exporta el enrutador
module.exports = router;