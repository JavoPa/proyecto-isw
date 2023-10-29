"use strict";
// Importa el modelo de datos 'User'
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
const User = require("../models/user.model.js");
const { handleError } = require("../utils/errorHandler");
const moment = require("moment");
//const mongoose = require('mongoose');


/**
 * Obtiene todas las becas disponibles
 * @returns {Promise} Promesa con el objeto de las becas
 */
async function getBecasPostulacion() {
  try {
    const becas = await Beca.find().select("nombre requisitos -_id");
    if (!becas) return [null, "No hay Becas"];
    return [[becas], null];
  } catch (error) {
    handleError(error, "becas.service -> getBecas");
  }
}

/**
 * Obtiene el estado de la postulacion del usuario
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getEstado(id) {
  try {
    const estado = await Postula.findOne({ postulante: id })
      .select({
        _id: 0,
        fecha_de_recepcion: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$fecha_recepcion",
          },
        },
        estado: 1,
        motivos: 1,
        beca: 1,
        documentosPDF: 1,
      })
      .populate({
        path: "beca",
        select: "-_id nombre",
      })
      .exec();
    if (!estado) return [null, "No hay postulacion"];

    return [estado, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getEstado");
  }
}


/**
 * Crea una postulacion subiendo la información del usuario 
 * @param {Object} user Objeto de usuario
 * @param {Object} beca Objeto de beca
 * @param {Object} archivos Archivos requeridos para la beca
 * @returns {Promise} Promesa con el objeto de usuario creado
 */

async function createPostulacion(archivos, user_id, beca_id) {
  try {
    if (!archivos || archivos.length === 0) {
      return respondError(req, res, 400, "No se subieron archivos.");
    }
    const { nombre , contenido } = archivos;

    const beca = await Beca.findById(beca_id);
    if (!beca) return [null, "No se encontró la beca"];

    //obtener datos del usuario
    const user = await User.findById(user_id);
    if (!user) return [null, "No se encontró el usuario"];

    // Verificar que el usuario no haya postulado a esta beca
    const postulacionExistente = await Postula.findOne({ postulante: user_id});
    if (postulacionExistente) return [null, "Ya existe una postulación para este usuario"];

    // Verificar si el usuario está dentro del plazo para postular
    const fechaActual = new Date();
    if (fechaActual > beca.fecha_fin) return [null, "El plazo para postular ha vencido"];
    if (fechaActual < beca.fecha_inicio) return [null, "El plazo para postular aún no comienza"];
    
    const postulacion = new Postula({
      postulante: user,
      beca: beca,
      estado: "Enviada",
      motivos: `Postulación ${beca.nombre}`,
      fecha_recepcion: fechaActual,
    });
    // Iterar sobre los archivos y agregarlos a la postulación
    archivos.forEach((archivo) => {
      postulacion.documentosPDF.push({
        nombre: archivo.originalname,
        contenido: archivo.buffer,
      });
    });

    await postulacion.save();

    return ["Postulacion enviada", null];
  } catch (error) {
    handleError(error, "postulacion.service -> createPostulacion");
  }
}
/**
 * Obtiene todas las postulaciones
 * @returns {Promise} Promesa con el objeto de los postulantes
 */
async function getPostulaciones() {
  try {
    const postulaciones = await Postula.find()
      //.select("beca postulante puntaje")
      .select("-documentosPDF")
      .populate({
        path: "beca",
        select: "nombre"
      })
      .populate({
        path: "postulante",
        select: "nombres apellidos"
      });

    if (!postulaciones) return [null, "No hay postulaciones"];

    return [postulaciones, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getPostulaciones");
  }
}

/**
 * Obtiene una postulacion por id
 * @returns {Promise} Promesa con el objeto de la postulacion
 */
async function getPostulacionById(id) {
  try {
    const postulacion = await Postula.findById({_id: id})
      //.select("beca postulante puntaje")
      //.select("-documentosPDF")
      .populate({
        path: "beca",
        select: "nombre"
      })
      .populate({
        path: "postulante",
        select: "nombres apellidos"
      });

    if (!postulacion) return [null, "La postulacion no existe"];

    return [postulacion, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getPostulacionById");
  }
}

/**
 * Crea una apelacion modificando el estado de postula y actualizando los documentos
 * @param {Object} archivos Archivos requeridos para la beca
 * @param {Object} id id del usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createApelacion(archivos, id) {
  try {
    //Buscar al postulante
    const postulacionFound = await Postula.findOne({ postulante: id })
    if (!postulacionFound) return [null, "El usuario no tiene postulacion"];

    //Verificacion de plazos (maximo 2 semanas despues de la fecha de fin de la beca)
    const fecha_actual = Date.now();
    const beca = await Beca.findById(postulacionFound.beca);
    if (!beca) return [null, "No se encontró la beca"];
    const fechaFinalizacionApelacion = new Date(beca.fecha_fin); //Se crea una fecha con la fecha de fin de la beca
    fechaFinalizacionApelacion.setDate(fechaFinalizacionApelacion.getDate() + 14); //Se le suman 14 dias a la fecha de fin de la beca
    if (fecha_actual > fechaFinalizacionApelacion) { //Si se sobre pasa de las 2 semanas de plazo siguientes a la fecha fin de la beca
      return [null, "El plazo de apelacion ha vencido"];
    }
    if (fecha_actual < beca.fecha_fin){ //Si aun no termina el periodo de postulacion la beca
      return [null, "El periodo de apelacion aun no comienza"];
    }
    
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
    postulacionFound.fecha_recepcion = fecha_actual;
    await postulacionFound.save();

    return ["Apelacion enviada", null];
  } catch (error) {
    handleError(error, "postulacion.service -> createApelacion");
  }
}

module.exports = {
  getBecasPostulacion,
  createPostulacion,
  getEstado,
  getPostulaciones,
  getPostulacionById,
  createApelacion,
};
