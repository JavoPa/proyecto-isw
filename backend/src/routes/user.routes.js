"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de usuarios */
const usuarioController = require("../controllers/user.controller.js");

const apelacionController = require("../controllers/apela.controller.js");

const postulacionController = require("../controllers/postulacion.controller.js");

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
router.get('/perfil', (req, res) => {
  usuarioController.getMyUser(req, res);
});

// Rutas para requerimiento de seleccion
router.get('/postulantes', authorizationMiddleware.isAdmin, usuarioController.getPostulantes); // Obtiene a todos los postulantes
router.get("/postulantes/:id", authorizationMiddleware.isAdmin, usuarioController.getPostulanteById); // Obtiene la informacion de un solo postulante
router.get("/postulaciones", authorizationMiddleware.isAdmin, usuarioController.getPostulaciones); // Obtiene todas las postulaciones
router.get("/postulaciones/:id", authorizationMiddleware.isAdmin, usuarioController.getPostulacionById); // Obtiene una postulacion por su id
router.get("/postulaciones/:id/documentos/:docnum", authorizationMiddleware.isAdmin, usuarioController.getDocuments); // Obtiene documentos por id de postulacion
router.put("/postulaciones/:id/puntaje", authorizationMiddleware.isAdmin, usuarioController.updatePuntaje); // Actualiza puntaje por id de postulacion
router.put("/postulaciones/:id/estado", authorizationMiddleware.isAdmin, usuarioController.updateEstado); // Actualiza estado por id de postulacion
router.get("/postulaciones/:id/informe", authorizationMiddleware.isAdmin, usuarioController.getInformeById); // Obtiene informe de postulacion
router.get("/informe", authorizationMiddleware.isAdmin, usuarioController.getInforme); // Informe de becas asignadas y puntaje

// Ruta para requerimiento de apelacion por parte del encargado
router.get("/apelaciones", authorizationMiddleware.isAdmin, apelacionController.getApelaciones); // Obtiene todas las apelaciones
router.get("/apelacion/:id", authorizationMiddleware.isAdmin, apelacionController.getApelacionById); // Obtiene una apelacion por su id
router.post("/postulacion/:id/actualizarmotivos", authorizationMiddleware.isAdmin, postulacionController.actualizarMotivos); // Establece motivos y mensaje de documentos faltantes opcional
router.post("/apelacion/:id/actualizarestado", authorizationMiddleware.isAdmin, apelacionController.actualizarEstado); // Actualiza estado de apelacion

// Exporta el enrutador
module.exports = router;
