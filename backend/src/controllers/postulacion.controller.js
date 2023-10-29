"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
const PostulacionService = require("../services/postulacion.service");

async function getBecasPostulacion(req, res) {
    try {
        const [becas, errorBecas] = await PostulacionService.getBecasPostulacion();
        if (errorBecas) return respondError(req, res, 404, errorBecas);
    
        becas.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, becas);
    } catch (error) {
        handleError(error, "postulacion.controller -> getBecasPostulacion");
        respondError(req, res, 400, error.message);
    }
}

async function createPostulacion(req, res) {
  try {
    const body = []
    for (const archivo of req.files) {
      body.push({
        nombre: archivo.originalname,
        contenido: archivo.buffer,
      })
    ;
    }
    // Extract the beca_id from the request
    const beca_id = req.body.beca_id; // You should make sure that the beca_id is sent in the request body

    const [postulacion, errorPostulacion] = await PostulacionService.createPostulacion(body, req._id, beca_id);

    if (errorPostulacion) return respondError(req, res, 400, errorPostulacion);
    if (!postulacion) {
      return respondError(req, res, 400, "No se creó la postulación");
    }

    respondSuccess(req, res, 201, postulacion);
  } catch (error) {
    handleError(error, "postulacion.controller -> createPostulacion");
    respondError(req, res, 500, "No se creó la postulación");
  }
}
/**
 * Obtiene el estado de postulacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getEstado(req, res) {
    try {
      const id = req._id;
      const [estado, errorId] = await PostulacionService.getEstado(id);
      if (errorId) return respondError(req, res, 404, errorId);
  
      respondSuccess(req, res, 200, estado);
    } catch (error) {
      handleError(error, "postulacion.controller -> getEstado");
      respondError(req, res, 500, "No se pudo obtener el estado");
    }
  }
  
  /**
 * Crea la apelacion de la postulacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
  async function createApelacion(req, res) {
    try {
      const body = {
        nombre: req.file.originalname,
        contenido: req.file.buffer,
      };
      const [newApelacion, apelacionError] = await PostulacionService.createApelacion(body, req._id);
  
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

module.exports = {
    getBecasPostulacion,
    createPostulacion,
    getEstado,
    createApelacion,
};