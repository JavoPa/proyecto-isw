"use strict";
// Importa el modelo de datos 'User'
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
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
        fecha_recepcion: 1,
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
        _id: 0,
      })
      .populate("")
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
async function createPostulacion(user, beca, archivos) {
  try {
    const { nombre, contenido } = archivos;

    // Verificar si el usuario ya tiene una postulación para esta beca
    const postulacionExistente = await Postula.findOne({ postulante: user._id});
    if (postulacionExistente) return [null, "Ya existe una postulación para este usuario"];

    // Verificar si el usuario ha subido los archivos requeridos
    if (!nombre || !contenido) return [null, "Debe subir los archivos requeridos"];
    
    // Check if the file type is pdf, png or jpg
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(contenido.mimetype)) {
      return [null, "El archivo debe ser pdf, png o jpg"];
    }

    // Verificar si el usuario está dentro del plazo para postular
    const fechaActual = new Date();
    if (fechaActual > beca.fecha_fin) return [null, "El plazo para postular ha vencido"];
    if (fechaActual < beca.fecha_inicio) return [null, "El plazo para postular aún no comienza"];

    // Crear la postulación
    const postulacion = new Postula({
      postulante: user,
      beca: beca,
      //postulante: mongoose.Types.ObjectId(user._id), 
      //beca: mongoose.Types.ObjectId(beca._id),
      documentosPDF: [{ nombre, contenido }],
      estado: "Enviada",
      motivos: `Postulación ${beca.nombre}`,
      fecha_recepcion: fechaActual,
    });
    await postulacion.save();

    return [postulacion, null];
  } catch (error) {
    handleError(error, "postulacion.service -> crearPostulacion");
  }
}


/**
 * Obtiene todas las postulaciones
 * @returns {Promise} Promesa con el objeto de los postulantes
 */
async function getPostulaciones() {
  try {
    const postulaciones = await Postula.find()
      .select("beca postulante puntaje")
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
  createApelacion,
};
