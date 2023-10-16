"use strict";
const Requisito = require("../models/requisitos.model");
const { handleError } = require("../utils/errorHandler");

1/**
 * @returns {Promise}
 */
async function getReq() {
    try {
      const requisito = await Requisito.find();
      if (!requisito) return [null, "No hay requisitos"];
      return [requisito, null];
    } catch (error) {
      handleError(error, "becas.service -> getBecas");
    }
  }

/** 
 * @param {number} codigo
 * @returns {Promise} 
 */
async function getReqByCod(codigo) {
    try {
      const requisito = await Requisito.findOne({ codigo });
      if (!requisito) return [null, "El requisito no existe"];
      return [requisito, null];
    } catch (error) {
      handleError(error, "requisitos.service -> getReqByCod");
    }
  }

/**
 * @param {Object} requisitoData
 * @returns {Promise} 
 */
async function CrearRequisito(requisitoData) {
    try {
      const { descripcion, codigo } = requisitoData;  
      const requisitoExistente = await Requisito.findOne({ codigo });
      if (requisitoExistente) {
        return [null, "El requisito ya existe"];
      }
        const newRequisito = new Requisito({
        descripcion,
        codigo,
      });  
      await newRequisito.save();  
      return [newRequisito, null];
    } catch (error) {
      handleError(error, "requisitos.service -> createRequisito");
    }
}

/**
 * @param {string} codigo
 * @param {Object} requisitoData
 * @returns {Promise} 
 */
async function ActualizarRequisito(codigo, requisitoData) {
    try {
      // Desestructura los datos del requisito desde requisitoData
      const { descripcion } = requisitoData;
  
      // Verifica si existe un requisito con el mismo código
      const requisitoExistente = await Requisito.findOne({ codigo });
  
      if (!requisitoExistente) {
        return [null, "El requisito no existe"];
      }
  
      // Actualiza los campos del requisito existente
      requisitoExistente.descripcion = descripcion;
  
      // Guarda los cambios en el requisito
      await requisitoExistente.save();
  
      return [requisitoExistente, null];
    } catch (error) {
      handleError(error, "requisitos.service -> updateRequisito");
    }
  }


/**
 * @param {number} codigo
 * @returns {Promise}
 */
async function BorrarRequisito(codigo) {
    try {
      return await Requisito.findOneAndDelete(codigo);
    } catch (error) {
      handleError(error, "becas.service -> BorrarBeca");
    }
}

module.exports = {
    getReq,
    getReqByCod,
    ActualizarRequisito,
    BorrarRequisito,
    CrearRequisito,
  };