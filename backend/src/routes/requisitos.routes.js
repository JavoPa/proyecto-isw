"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

//**Controlador de becas */
const RequisitosController = require("../controllers/requisitos.controller");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define rutas para las becas
router.get('/', authorizationMiddleware.isAdmin, RequisitosController.getReq);
router.post('/',authorizationMiddleware.isAdmin, RequisitosController.CrearRequisito);
router.get('/:id', authorizationMiddleware.isAdmin, RequisitosController.getReqByCod);
router.put('/:id', authorizationMiddleware.isAdmin, RequisitosController.ActualizarRequisitoCodigo);
router.delete('/:id', authorizationMiddleware.isAdmin, RequisitosController.BorrarRequisitoCodigo);

// Exporta el enrutador
module.exports = router;