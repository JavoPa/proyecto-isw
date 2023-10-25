"use strict";
// Importa el modelo de datos 'User'
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
const { handleError } = require("../utils/errorHandler");



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
 * Crea una postulacion subiendo la información del usuario 
 * @param {Object} user Objeto de usuario
 * @param {Object} beca Objeto de beca
 * @param {Object} archivos Archivos requeridos para la beca
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function crearPostulacion(user, beca, archivos) {
  try {
    const { nombre, contenido } = archivos;

    // Verificar si el usuario ya tiene una postulación para esta beca
    const postulacionExistente = await Postula.findOne({ postulante: user._id, beca: beca._id });
    if (postulacionExistente) return [null, "Ya existe una postulación para esta beca"];

    // Verificar si la beca está disponible
    if (beca.estado !== "Disponible") return [null, "La beca no está disponible"];

    // Verificar si el usuario ya tiene una beca activa
    const becasActivas = await Postula.find({ postulante: user._id, estado: "Aprobada" });
    if (becasActivas.length > 0) return [null, "Ya tiene una beca activa"];

    // Verificar si el usuario ya ha sido rechazado para una beca en el último año
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);
    const postulacionesRechazadas = await Postula.find({
      postulante: user._id,
      estado: "Rechazada",
      fecha_recepcion: { $gte: fechaLimite },
    });
    if (postulacionesRechazadas.length > 0) return [null, "Ha sido rechazado para una beca en el último año"];

    // Verificar si el usuario ha subido los archivos requeridos
    if (!nombre || !contenido) return [null, "Debe subir los archivos requeridos"];

    // Verificar si el usuario está dentro del plazo para postular
    const fechaActual = new Date();
    if (fechaActual > beca.fecha_fin) return [null, "El plazo para postular ha vencido"];

    // Crear la postulación
    const postulacion = new Postula({
      postulante: user._id,
      beca: beca._id,
      documentosPDF: [{ nombre, contenido }],
      estado: "En revisión",
      motivos: "Postulación creada",
      fecha_recepcion: fechaActual,
    });
    await postulacion.save();

    return [postulacion, null];
  } catch (error) {
    handleError(error, "postulacion.service -> crearPostulacion");
  }
}

/**
 * Renueva una beca o postula nuevamente con los datos personales registrados
 * @param {Object} user Objeto de usuario
 * @param {Object} beca Objeto de beca
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function renovarPostulacion(user, beca) {
  try {
    // Verificar si el usuario ya tiene una postulación para esta beca
    const postulacionExistente = await Postula.findOne({ postulante: user._id, beca: beca._id });
    if (!postulacionExistente) return [null, "No existe una postulación para esta beca"];

    // Verificar si la beca está disponible
    if (beca.estado !== "Disponible") return [null, "La beca no está disponible"];

    // Verificar si el usuario ya tiene una beca activa
    const becasActivas = await Postula.find({ postulante: user._id, estado: "Aprobada" });
    if (becasActivas.length > 0) return [null, "Ya tiene una beca activa"];

    // Verificar si el usuario ha sido rechazado para una beca en el último año
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);
    const postulacionesRechazadas = await Postula.find({
      postulante: user._id,
      estado: "Rechazada",
      fecha_recepcion: { $gte: fechaLimite },
    });
    if (postulacionesRechazadas.length > 0) return [null, "Ha sido rechazado para una beca en el último año"];

    // Verificar si el usuario está dentro del plazo para postular
    const fechaActual = new Date();
    if (fechaActual > beca.fecha_fin) return [null, "El plazo para postular ha vencido"];

    // Actualizar la postulación
    postulacionExistente.estado = "En revisión";
    postulacionExistente.motivos = "Postulación renovada";
    postulacionExistente.fecha_recepcion = fechaActual;
    await postulacionExistente.save();

    return [postulacionExistente, null];
  } catch (error) {
    handleError(error, "postulacion.service -> renovarPostulacion");
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
    postulacionFound.fecha_recepcion = Date.now();
    await postulacionFound.save();

    return ["Apelacion enviada", null];
  } catch (error) {
    handleError(error, "postulacion.service -> createApelacion");
  }
}

module.exports = {
  getBecasPostulacion,
  crearPostulacion,
  getEstado,
  createApelacion,
};
