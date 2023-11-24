"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
const ApelacionService = require("../services/apela.service");
const { postulaDocumentosFaltantes } = require("../schema/postula.schema");
const { userIdSchema } = require("../schema/user.schema");

 /**
 * Crea la apelacion de la postulacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
  async function createApelacion(req, res) {
    try {
      const archivos = []
      for (const archivo of req.files) {
        archivos.push({
          nombre: archivo.originalname,
          contenido: archivo.buffer,
        });
      }
      const motivo = req.body.motivo;
      const [newApelacion, apelacionError] = await ApelacionService.createApelacion(motivo, archivos, req._id);
  
      if (apelacionError) return respondError(req, res, 400, apelacionError);
      if (!newApelacion) {
        return respondError(req, res, 400, "No se creo la apelacion");
      }
  
      respondSuccess(req, res, 201, newApelacion);
    } catch (error) {
      handleError(error, "user.controller -> createApelacion");
      respondError(req, res, 500, "No se creo la apelacion");
    }
  }

/**
 * Define los documentos faltantes en la postulacion rechazada
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
  async function updateDocumentosFaltantes(req, res) {
    try {
      const { params, body } = req;
      const { error: bodyError } = postulaDocumentosFaltantes.validate(body);
      if (bodyError) return respondError(req, res, 400, bodyError.message);
  
      const [postulacion, postulaError] = await ApelacionService.updateDocumentosFaltantes(params.id, body);
      if (postulaError) return respondError(req, res, 400, postulaError);
      
  
      respondSuccess(req, res, 200, postulacion);
    } catch (error) {
      handleError(error, "user.controller -> updateDocumentosFaltantes");
      respondError(req, res, 500, "No se pudo actualizar el estado de documentos faltantes");
    }
  }
  
  /**
 * Obtiene todas las apelaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getApelaciones(req, res) {
    try {
      const [apelaciones, errorApelaciones] = await ApelacionService.getApelaciones();
      if (errorApelaciones) return respondError(req, res, 404, errorApelaciones);
  
      apelaciones.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, apelaciones);
    } catch (error) {
      handleError(error, "apela.controller -> getApelaciones");
      respondError(req, res, 400, error.message);
    }
  }

/**
 * Obtiene una apelacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getApelacionById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [postulacion, errorPostulacion] = await ApelacionService.getApelacionById(params.id);

    if (errorPostulacion) return respondError(req, res, 404, errorPostulacion);

    respondSuccess(req, res, 200, postulacion);
  } catch (error) {
    handleError(error, "apela.controller -> getApelacionById");
    respondError(req, res, 500, "No se pudo obtener la apelacion");
  }
}

  module.exports = {
    createApelacion,
    updateDocumentosFaltantes,
    getApelaciones,
    getApelacionById
};