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

/**
 * Crea una apelacion modificando el estado de postula y actualizando los documentos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createApelacion(archivos, id) {
  try {
    const { nombre , contenido } = archivos;

    //Buscar al postulante
    const postulacionFound = await Postula.findOne({ postulante: id })
    if (!postulacionFound) return [null, "El usuario no tiene postulacion"];
    
    //Verificacion de postulacion previa rechazada
    if (postulacionFound.estado == "Apelada") return [null, "El usuario ya tiene una apelacion en proceso"];
    if (postulacionFound.estado != "Rechazada") return [null, "El usuario no presenta una postulacion rechazada"];

    //Agrega el archivo PDF a la matriz documentosPDF
    postulacionFound.documentosPDF.push({
      nombre: nombre,
      contenido: contenido,
    });
    postulacionFound.estado = "Apelada";
    postulacionFound.motivos = "Apelacion solicitada";
    postulacionFound.fecha_recepcion = Date.now();
    await postulacionFound.save();

    return ["Apelacion enviada", null];
  } catch (error) {
    handleError(error, "postulacion.service -> createApelacion");
  }
}

module.exports = {
  getEstado,
  createApelacion,
};
