"use strict";
const Becas = require("../models/beca.model");
const { handleError } = require("../utils/errorHandler");

1/**
 * @returns {Promise}
 */
async function getBecas() {
    try {
      const becas = await Becas.find()
       .select("_id nombre")
       .populate()
       .exec();
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
      const fecha_actual = Date.now();
      const fechafin = new Date(bec.fecha_fin);
      const fechainicio = new Date(bec.fecha_inicio);
      if (becaFound) return [null, "La beca ya existe"];
      if (fecha_actual > fechainicio && fecha_actual < fechafin){
        return [null, "No se pueden crear becas en periodo de postulacion"];
      }
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
      const fecha_actual = Date.now();
      /*Verificar que no se este modificando una beca durante el periodo de postulacion*/
      const fechaf = new Date(becFound.fecha_fin);
      const fechai = new Date(becFound.fecha_inicio);
      if (fecha_actual > fechai && fecha_actual < fechaf){
        return [null, "No se pueden modificar becas en periodo de postulacion"];
      }
      const { nombre, requisitos, documentos, fecha_inicio, fecha_fin, monto, tipo_pago } = bec;
      /*Verificar que la fecha actual no este entre las fechas de postulacion*/
      const fechafin = new Date(bec.fecha_fin);
      const fechainicio = new Date(bec.fecha_inicio);
      if (fecha_actual > fechainicio && fecha_actual < fechafin){
        return [null, "No puedes estar entre el periodo de postulacion"];
      }

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
      const becas = await Becas.findById({ _id: id }) 
      if (!becas) return [null, "La beca no existe"];
      const fecha_actual = Date.now();
      const fechaf = new Date(becas.fecha_fin);
      const fechai = new Date(becas.fecha_inicio);
      if (fecha_actual > fechai && fecha_actual < fechaf){
        return [null, "No puedes borrar una beca en periodo de postulacion"];
      }
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