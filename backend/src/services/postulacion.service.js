"use strict";
// Importa el modelo de datos 'User'
const Postula = require("../models/postula.model.js");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene el estado de la postulacion del usuario
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getEstado(id) {
  try {
    const estado = await Postula.findOne({ postulante: id })
      .select("estado fecha_recepcion motivos -_id")
      .populate("")
      .exec();
    if (!estado) return [null, "No hay postulacion"];

    return [estado, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getEstado");
  }
}

module.exports = {
  getEstado,
};
