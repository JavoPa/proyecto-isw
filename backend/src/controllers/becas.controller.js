"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const BecaService = require("../services/becas.service");
const RequisitoService = require("../services/requisitos.service")
const { handleError } = require("../utils/errorHandler");

/**
 * @param {Object} req 
 * @param {Object} res
 */
async function getBecas(req, res) {
  try {
    const [becas, errorbecas] = await BecaService.getBecas();
    if (errorbecas) return respondError(req, res, 404, errorbecas);
    
    const becasConDescripciones = await Promise.all(
      becas.map(async (beca) => {
        const requisitosConDescripciones = await Promise.all(
          beca.requisitos.map(async (codigoRequisito) => {
            const [requisito, errorRequisito] = await RequisitoService.getReqByCod(codigoRequisito);
            return requisito ? requisito.descripcion : null;
          })
        );
        return {
          ...beca.toObject(),
          requisitos: requisitosConDescripciones,
        };
      })
    );
    
    becas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, becasConDescripciones);
  } catch (error) {
    handleError(error, "becas.controller -> getBecas");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @param {Object} req 
 * @param {Object} res
 */
async function getBecasid(req, res) {
    try {
      const { params } = req;
      const [bec, errorBeca] = await BecaService.getBecasid(params.id);
  
      if (errorBeca) return respondError(req, res, 404, errorBeca);
  
      respondSuccess(req, res, 200, bec);
    } catch (error) {
      handleError(error, "becas.controller -> getBecasid");
      respondError(req, res, 500, "No se pudo obtener la beca");
    }
  }

/**
 * @param {Object} req 
 * @param {Object} res 
 */
async function createBeca(req, res) {
    try {  
      const { body } = req;
      const [newBeca, BecaError] = await BecaService.createBeca(body);
  
      if (BecaError) return respondError(req, res, 400, BecaErrorError);
      if (!newBeca) {
        return respondError(req, res, 400, "No se creo la Beca");
      }
  
      respondSuccess(req, res, 201, newBeca);
    } catch (error) {
      handleError(error, "beca.controller -> createBeca");
      respondError(req, res, 500, "No se la beca");
    }
  }

/**
 * @param {Object} req 
 * @param {Object} res 
 */
async function updateBeca(req, res) {
    try {
      const { params, body } = req;
      const [bec, becaError] = await BecaService.updateBeca(params.id, body);
  
      if (becaError) return respondError(req, res, 400, becaError);
  
      respondSuccess(req, res, 200, bec);
    } catch (error) {
      handleError(error, "becas.controller -> updateBeca");
      respondError(req, res, 500, "No se pudo actualizar la beca");
    }
  }
  
/**
 * @param {Object} req 
 * @param {Object} res
 */
async function BorrarBeca(req, res) {
    try {
      const { params } = req;
      const bec = await BecaService.BorrarBeca(params.id);
      !bec
        ? respondError(
            req,
            res,
            404,
            "No se encontro la beca solicitada",
            "Verifique el id ingresado",
          )
        : respondSuccess(req, res, 200, bec);
    } catch (error) {
      handleError(error, "becas.controller -> BorrarBeca");
      respondError(req, res, 500, "No se pudo eliminar la beca");
    }
  }

module.exports = {
    getBecas,
    getBecasid,
    updateBeca,
    BorrarBeca,
    createBeca,
  };