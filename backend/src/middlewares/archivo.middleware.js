"use strict";
// Archivo - Subir archivo a la BD
const multer = require('multer');
const storage = multer.memoryStorage(); //Configurar el almacenamiento
const upload = multer({ storage: storage });
const { respondError } = require("../utils/resHandler.js");
const { handleError } = require("../utils/errorHandler.js");

//tipos de archivos permitidos
const allowedFileTypes = ['jpg', 'jpeg', 'png', 'pdf']; // Define allowed file extensions

/**
 * Verifica que el archivo sea una imagen o un pdf
 * @param {Array} files - Arreglo de archivos
 * @returns {Array} Arreglo de archivos inválidos
 */
function validateFileExtensions(files) {
  const invalidFiles = files.filter((file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    return !allowedFileTypes.includes(fileExtension);
  });
  return invalidFiles;
}

/**
 * Maneja la subida de archivos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function subirSingle(req, res, next) {
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
      const files = req.files;
      const invalidFiles = validateFileExtensions(files);
      if (invalidFiles.length > 0) {
        return respondError(
          req,
          res,
          400,
          "Archivos con extensiones no permitidas, solo se permiten archivos con las siguientes extensiones: " + allowedFileTypes.join(', '),
        );
      }
      next();
    });
  } catch (error) {
    handleError(error, "archivo.middleware -> subir");
  }
}

async function subirArray(req, res, next) {
  try {
    upload.array('archivoPDF',5)(req, res, function (err) {
      if (err) {
        return respondError(
          req,
          res,
          400,
          "Error al subir el archivo",
        );
      }
      if (!req.files) {
        return respondError(
          req,
          res,
          400,
          "No se recibió el archivo",
        );
      }
      const files = req.files;
      const invalidFiles = validateFileExtensions(files);
      if (invalidFiles.length > 0) {
        return respondError(
          req,
          res,
          400,
          "Archivos con extensiones no permitidas, solo se permiten archivos con las siguientes extensiones: " + allowedFileTypes.join(', '),
        );
      }
      next();
    });
  } catch (error) {
    handleError(error, "archivo.middleware -> subir");
  }
}

module.exports = {
  subirSingle,
  subirArray,
};
