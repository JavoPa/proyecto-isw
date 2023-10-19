"use strict";
const Becas = require("../models/beca.model");
const { handleError } = require("../utils/errorHandler");

1/**
 * @returns {Promise}
 */
async function getBecas() {
    try {
      const becas = await Becas.find();
      if (!becas) return [null, "No hay Becas"];
      return [becas, null];
    } catch (error) {
      handleError(error, "becas.service -> getBecas");
    }
  }

/** 
 * @param {string} Id
 * @returns {Promise} 
 */
async function getBecasid(id) {
  try {
    const becas = await Becas.findById({ _id: id }) 
    if (!becas) return [null, "La beca no existe"];

    return [becas, null];
  } catch (error) {
    handleError(error, "becas.service -> getBecasid");
  }
}

/**
 * @param {Object} bec
 * @returns {Promise} 
 */
async function createBeca(bec) {
    try {
      const { nombre, requisitos, documentos, fecha_inicio , fecha_fin , monto, tipo_pago } = bec;  
      const becaFound = await Becas.findOne({ nombre: bec.nombre });
      if (becaFound) return [null, "La beca ya existe"];

      const newbeca = new Becas({
        nombre,
        requisitos,
        documentos,
        fecha_inicio,
        fecha_fin,
        monto,
        tipo_pago,
      });
      await newbeca.save();
      return [newbeca, null];
    } catch (error) {
      handleError(error, "becas.service -> CreateBeca");
    }
}

  /**
   * @param {string} id
   * @param {Object} bec
   * @returns {Promise} 
   */
async function updateBeca(id, bec) {
    try {
      const becFound = await Becas.findById(id);
      if (!becFound) return [null, "la beca no existe"];
  
      const { nombre, requisitos, documentos, fecha_inicio, fecha_fin, monto, tipo_pago } = bec;  
      const becUpdated = await Becas.findByIdAndUpdate(
        id,
        {
            nombre,
            requisitos,
            documentos,
            fecha_inicio,
            fecha_fin,
            monto,
            tipo_pago,
        },
        { new: true },
      );
  
      return [becUpdated, null];
    } catch (error) {
      handleError(error, "becas.service -> updateBeca");
    }
}

/**
 * @param {string} Id
 * @returns {Promise}
 */
async function BorrarBeca(id) {
    try {
      return await Becas.findByIdAndDelete(id);
    } catch (error) {
      handleError(error, "becas.service -> BorrarBeca");
    }
}

module.exports = {
    getBecas,
    getBecasid,
    updateBeca,
    BorrarBeca,
    createBeca,
  };