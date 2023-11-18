"use strict";
const { handleError } = require("../utils/errorHandler");
const Postula = require("../models/postula.model.js");
const Apela = require("../models/apela.model.js");
const Beca = require("../models/beca.model.js");

/**
 * Crea una apelacion modificando el estado de postula y subiendo los documentos a la tabla apela
 * @param {Object} archivos Archivos requeridos para la beca
 * @param {Object} id id del usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createApelacion(archivos, id) {
    try {
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
      if (postulacionFound.estado == "Apelada") return [null, "El usuario ya tiene una apelacion en proceso"];
      if (postulacionFound.estado != "Rechazada") return [null, "El usuario no presenta una postulacion rechazada"];
  
      //Crea la apelacion
      const apelacion = new Apela({
        postulacion: postulacionFound,
      });
  
      //Agrega el archivo a la apelacion
      archivos.forEach((archivo) => {
        apelacion.documentosPDF.push({
          nombre: archivo.nombre,
          contenido: archivo.contenido,
        });
      });
      await apelacion.save();
      postulacionFound.estado = "Apelada";
      postulacionFound.motivos = "Apelacion solicitada";
      await postulacionFound.save();
  
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
        .select("-documentosPDF")
        .populate({
          path: "postulacion"
        });
  
      if (!apelaciones) return [null, "No hay apelaciones"];
  
      return [apelaciones, null];
    } catch (error) {
      handleError(error, "apela.service -> getApelaciones");
    }
  }

  module.exports = {
    createApelacion,
    updateDocumentosFaltantes,
    getApelaciones,
  };
  