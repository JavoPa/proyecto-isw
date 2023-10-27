"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");

/** Enrutador de becas  */
const becasRoutes = require("./becas.routes.js")

/** Enrutador de requisitos  */
const requisitosRoutes = require("./requisitos.routes.js")

/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/** Enrutador de postulacion */
const postulacionRoutes = require("./postulacion.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para las becas /api/becas
router.use("/becas", authenticationMiddleware, becasRoutes);
// Define las rutas para los requisitos /api/requisitos
router.use("/requisitos", authenticationMiddleware, requisitosRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
// Define las rutas para la postulación /api/postulacion
router.use("/postulacion", authenticationMiddleware, postulacionRoutes);

// Exporta el enrutador
module.exports = router;
