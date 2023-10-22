"use strict";
// Archivo - Subir archivo a la BD
const multer = require('multer');
const storage = multer.memoryStorage(); //Configurar el almacenamiento
const upload = multer({ storage: storage });
const { respondError } = require("../utils/resHandler.js");
const { handleError } = require("../utils/errorHandler.js");

/**
 * Maneja la subida de archivos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function subir(req, res, next) {
  try {
    upload.single('archivoPDF')(req, res, function (err) {
      if (err) {
        return respondError(
          req,
          res,
          400,
          "Error al subir el archivo",
        );
      }
      if (!req.file) {
        return respondError(
          req,
          res,
          400,
          "No se recibió el archivo",
        );
      }
      next();
    });
  } catch (error) {
    handleError(error, "archivo.middleware -> subir");
  }
}

module.exports = {
  subir,
};
