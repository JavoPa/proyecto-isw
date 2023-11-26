"use strict";
// Importa el modelo de datos 'User'
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
const User = require("../models/user.model.js");
const { handleError } = require("../utils/errorHandler");
const Apela = require("../models/apela.model.js");


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
    //Buscar la ultima postulacion del usuario
    const postulacion = await Postula.findOne({ postulante: id })
      .sort({ fecha_recepcion: -1 })
      .limit(1)
      .select({
        _id: 1,
        fecha_de_recepcion: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$fecha_recepcion",
          },
        },
        estado: 1,
        motivos: 1,
        beca: 1,
        documentosFaltantes: 1,
      })
      .populate({
        path: "beca",
        select: "nombre fecha_fin",
      })
      .exec();
    if (!postulacion) return [null, "No hay postulacion"];

    //Buscar la apelacion de la postulacion
    const apelacion = await Apela.findOne({ postulacion: postulacion._id })
      .select({
        _id: 0,
        fecha_de_apelacion: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$fecha_apelacion",
          },
        },
        estado: 1,
        motivos: 1,
      })
      .exec();
    //if (!apelacion) return [postulacion, null];
    //Creacion de fecha fin de apelacion
    const fechaInicioApelacion = new Date(postulacion.beca.fecha_fin).toLocaleDateString('es-ES', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
    const fechaFinApelacion = new Date(postulacion.beca.fecha_fin);
    fechaFinApelacion.setDate(fechaFinApelacion.getDate() + 14);
    const fechaFinFormateada = fechaFinApelacion.toLocaleDateString('es-ES', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
    const estado = {
      postulacion: postulacion,
      apelacion: apelacion,
      fecha_inicio_apelacion: fechaInicioApelacion,
      fecha_fin_apelacion: fechaFinFormateada,
    };
    return [estado, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getEstado");
  }
}


/**
 * Crea una postulacion
 * @param {Object} archivos Objeto de archivos
 * @param {string} user_id Id del usuario
 * @param {string} beca_id Id de la beca
 * @returns {Promise} Promesa con el objeto de la postulacion creada
 */
async function createPostulacion(archivos, user_id, beca_id, comentario) {
  try {
    //verificar que se hayan subido archivos
    if (!archivos || archivos.length === 0) {
      return [null, "No se subieron archivos."];
    }
    
    //obtener datos del usuario
    const user = await User.findById(user_id);
    if (!user) return [null, "No se encontró el usuario"];

    //obtener datos de la beca
    const beca = await Beca.findById(beca_id);
    if (!beca) return [null, "No se encontró la beca"];

    // Verificar si el usuario está dentro del plazo para postular
    const fechaActual = new Date();
    if (fechaActual > beca.fecha_fin) return [null, "El plazo para postular ha vencido"];
    if (fechaActual < beca.fecha_inicio) return [null, "El plazo para postular aún no comienza"];

   

    // Verificar que el usuario no haya postulado a esta beca en el año actual
    const postulacionExistente= await Postula.findOne({ postulante: user_id })
    if (postulacionExistente) return [null, "Ya existe una postulación para este usuario"];

    //crear la postulacion
    const postulacion = new Postula({
      postulante: user,
      beca: beca,
      estado: "Enviada",
      motivos: `Postulación ${beca.nombre}`,
      fecha_recepcion: fechaActual,
      comentario: comentario,
    });
    // Iterar sobre los archivos y agregarlos a la postulación
    archivos.forEach((archivo) => {
      postulacion.documentosPDF.push({
        nombre: archivo.nombre,
        contenido: archivo.contenido,
      });
    });

    //guardar la postulacion
    await postulacion.save();

    return ["Postulacion creada", null];
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

module.exports = {
  getBecasPostulacion,
  createPostulacion,
  getEstado,
  getPostulaciones,
  getPostulacionById,
};
