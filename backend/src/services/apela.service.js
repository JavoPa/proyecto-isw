"use strict";
const { handleError } = require("../utils/errorHandler");
const Postula = require("../models/postula.model.js");
const Apela = require("../models/apela.model.js");
const Beca = require("../models/beca.model.js");
const User = require("../models/user.model.js");

/**
 * Crea una apelacion modificando el estado de postula y subiendo los documentos a la tabla apela
 * @param {Object} archivos Archivos requeridos para la beca
 * @param {Object} id id del usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createApelacion(motivo, archivos, id) {
    try {
      if(!motivo) return [null, "No se ingreso el motivo de la apelacion"];
      //Buscar ultima postulacion del usuario
      const postulacionFound = await Postula.findOne({ postulante: id }).sort({ fecha_recepcion: -1 }).limit(1).exec()
      if (!postulacionFound) return [null, "El usuario no tiene postulacion"];
  
      //Verificacion de plazos (maximo 2 semanas despues de la fecha de fin de la beca)
      const fecha_actual = Date.now();
      if (!postulacionFound.beca) return [null, "No se encontró la beca"];
      const beca = await Beca.findById(postulacionFound.beca);
      const fechaFinalizacionApelacion = new Date(beca.fecha_fin); //Se crea una fecha con la fecha de fin de la beca
      fechaFinalizacionApelacion.setDate(fechaFinalizacionApelacion.getDate() + 14); //Se le suman 14 dias a la fecha de fin de la beca
      if (fecha_actual > fechaFinalizacionApelacion) { //Si se sobre pasa de las 2 semanas de plazo siguientes a la fecha fin de la beca
        return [null, "El plazo de apelacion ha vencido"];
      }
      if (fecha_actual < beca.fecha_fin){ //Si aun no termina el periodo de postulacion la beca
        return [null, "El periodo de apelacion aun no comienza"];
      }
      
      //Verificacion de postulacion previa rechazada
      //if (postulacionFound.estado == "Apelada") return [null, "Ya tienes una apelacion en proceso"];
      if (postulacionFound.estado != "Rechazada") return [null, "No tienes una postulacion rechazada"];
      //Verificacion de que no haya apelecion previa
      const apelacionFound = await Apela.findOne({ postulacion: postulacionFound._id });
      if (apelacionFound) return [null, "Ya tienes una apelacion en proceso"];
  
      //Crea la apelacion
      const apelacion = new Apela({
        postulacion: postulacionFound,
        motivo: motivo,
      });
  
      //Agrega el archivo a la apelacion
      archivos.forEach((archivo) => {
        apelacion.documentosPDF.push({
          nombre: archivo.nombre,
          contenido: archivo.contenido,
        });
      });
      await apelacion.save();
      //postulacionFound.estado = "Apelada";
      //postulacionFound.motivos = "Apelacion solicitada";
      //await postulacionFound.save();
  
      return ["Apelacion enviada", null];
    } catch (error) {
      handleError(error, "apela.service -> createApelacion");
    }
  }

  async function updateDocumentosFaltantes(id, body) {
    try {
      const postulacionFound = await Postula.findById(id);
      if (!postulacionFound) return [null, "La postulacion no existe"];
  
      const postulacionUpdated = await Postula.findByIdAndUpdate(
        id,
        {
          $push: { documentosFaltantes: { $each: body.documentosFaltantes } }
        },
        { new: true },
      );
  
      return [postulacionUpdated, null];
    } catch (error) {
      handleError(error, "apela.service -> updateDocumentosFaltantes");
    }
  }
  
  /**
 * Obtiene todas las apelaciones
 * @returns {Promise} Promesa con el objeto de los postulantes
 */
async function getApelaciones() {
    try {
      const apelaciones = await Apela.find()
        .select({
          motivo: 1,
          fecha_de_apelacion: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$fecha_apelacion",
            },
          },
        })
        .populate({ 
          path: "postulacion", 
          select: 'estado motivos',
          populate: [
            { 
              path: "postulante",
              select: 'nombres apellidos'
            },
            { 
              path: "beca",
              select: 'nombre'
            },
          ]
        })

      if (!apelaciones) return [null, "No hay apelaciones"];
  
      return [apelaciones, null];
    } catch (error) {
      handleError(error, "apela.service -> getApelaciones");
    }
  }

/**
 * Obtiene una apelacion por id
 * @returns {Promise} Promesa con el objeto de la postulacion
 */
async function getApelacionById(id) {
  try {
    const apelacion = await Apela.findById({_id: id})
    .select({
      fecha_de_apelacion: {
        $dateToString: {
          format: "%d-%m-%Y",
          date: "$fecha_apelacion",
        },
      },
      postulacion: 1,
      motivo: 1,
    })

    if (!apelacion) return [null, "La apelacion no existe"];
    if (!apelacion.postulacion) return [null, "La apelacion no tiene una postulacion asociada"];

    const postulacion = await Postula.findById({_id: apelacion.postulacion})
    .select({
      fecha_de_recepcion: {
        $dateToString: {
          format: "%d-%m-%Y",
          date: "$fecha_recepcion",
        },
      },
      estado: 1,
      motivos: 1,
      postulante: 1,
      beca: 1,
    })
    if (!postulacion.beca) return [null, "La postulacion no tiene beca asociada"];
    const beca = await Beca.findById({_id: postulacion.beca})
    .select({
      nombre: 1,
      documentos: 1,
    })
    const postulante = await User.findById({_id: postulacion.postulante})
    .select({
      nombres: 1,
      apellidos: 1,
      email: 1,
      rut: 1,
    })
    const result = {
      apelacion,
      postulacion,
      beca,
      postulante
    };
    return [result, null];
  } catch (error) {
    handleError(error, "apela.service -> getApelacionById");
  }
}

  module.exports = {
    createApelacion,
    updateDocumentosFaltantes,
    getApelaciones,
    getApelacionById
  };
  