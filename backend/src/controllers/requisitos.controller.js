"use strict";
const { respondSuccess, respondError, respondSuccess2 } = require("../utils/resHandler");
const { handleError } = require("../utils/errorHandler");
const requisitoSchema = require("../schema/requisitos.schema");
const RequisitoService = require('../services/requisitos.service');

/**
 * @param {Object} req
 * @param {Object} res
 */
async function getReq(req, res) {
    try {
      const [requisitos, errorRequisitos] = await RequisitoService.getReq();
      if (errorRequisitos) return respondError(req, res, 404, errorRequisitos); 
      const response = requisitos.map(requisito => ({
        descripcion: requisito.descripcion,
        _id: requisito._id,
        codigo: requisito.codigo,
      }));
  
      response.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, response);
    } catch (error) {
      handleError(error, "requisitos.controller -> getRequisitos");
      respondError(req, res, 400, error.message);
    }
  }
  
  /**
   * @param {Object} req
   * @param {Object} res
   */
  async function getReqByCod(req, res) {
    try {
      const { params } = req;
      const [requisito, errorRequisito] = await RequisitoService.getReqByCod(params.id);
      if (errorRequisito) return respondError(req, res, 404, errorRequisito);
      respondSuccess(req, res, 200, requisito);
    } catch (error) {
      handleError(error, "requisitos.controller -> getRequisitoByCodigo");
      respondError(req, res, 500, "No se pudo obtener el requisito");
    }
  }
  
  /**
   * @param {Object} req
   * @param {Object} res
   */
  async function CrearRequisito(req, res) {
    try {
      const { body } = req;
      const { error: bodyError } = requisitoSchema.validate(body);
      if (bodyError) return respondError(req, res, 400, bodyError.message);

      const [newRequisito, requisitoError] = await RequisitoService.CrearRequisito(body);
      if (requisitoError) return respondError(req, res, 400, requisitoError);
      if (!newRequisito) {
        return respondError(req, res, 400, "No se creó el requisito");
      }
  
      respondSuccess(req, res, 201, newRequisito);
    } catch (error) {
      handleError(error, "requisitos.controller -> createRequisito");
      respondError(req, res, 500, "No se creó el requisito");
    }
  }
  
  /**
   * @param {Object} req
   * @param {Object} res
   */
  async function ActualizarRequisitoCodigo(req, res) {
    try {
      const { params, body } = req;
      const { error: bodyError } = requisitoSchema.validate(body);
      if (bodyError) return respondError(req, res, 400, bodyError.message);
      
      const [updatedRequisito, requisitoError] = await RequisitoService.ActualizarRequisito(params.id, body);
      if (requisitoError) return respondError(req, res, 400, requisitoError);
  
      respondSuccess(req, res, 200, updatedRequisito);
    } catch (error) {
      handleError(error, "requisitos.controller -> updateRequisitoByCodigo");
      respondError(req, res, 500, "No se pudo actualizar el requisito");
    }
  }

/**
 * @param {Object} req 
 * @param {Object} res
 */
async function BorrarRequisitoCodigo(req, res) {
    try {
      const { params } = req;
      const requisito = await RequisitoService.BorrarRequisito(params.id);
      !requisito
        ? respondError(
            req,
            res,
            404,
            "No se encontro el requisito",
            "Verifique el codigo ingresado",
          )
        : respondSuccess(req, res, 200, requisito);
    } catch (error) {
      handleError(error, "requisitos.controller -> BorrarRequisitoCodigo");
      respondError(req, res, 500, "No se pudo eliminar el requisito");
    }
}
  
  module.exports = {
    getReq,
    getReqByCod,
    CrearRequisito,
    ActualizarRequisitoCodigo,
    BorrarRequisitoCodigo,
  };