"use strict";
const Requisito = require("../models/requisitos.model");
const { handleError } = require("../utils/errorHandler");

/**
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
 * @param {String} Id
 * @returns {Promise} 
 */
async function getReqByCod(id) {
    try {
      const requisito = await Requisito.findById({ _id: id });
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
      const { descripcion } = requisitoData;  
      const requisitoExistente = await Requisito.findOne({ descripcion });
      if (requisitoExistente) {
        return [null, "El requisito ya existe"];
      }
        const newRequisito = new Requisito({
        descripcion,
      });  
      await newRequisito.save();  
      return [newRequisito, null];
    } catch (error) {
      handleError(error, "requisitos.service -> createRequisito");
    }
}

/**
 * @param {string} id
 * @param {Object} requisitoData
 * @returns {Promise} 
 */
async function ActualizarRequisito(id, requisitoData) {
    try {
      // Desestructura los datos del requisito desde requisitoData
      const { descripcion } = requisitoData;
  
      // Verifica si existe un requisito con el mismo código
      const requisitoExistente = await Requisito.findById(id);
  
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
 * @param {number} id
 * @returns {Promise}
 */
async function BorrarRequisito(id) {
    try {
      return await Requisito.findOneAndDelete({ _id: id});
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