"use strict";

const Joi = require("joi");

const postulaPuntajeSchema = Joi.object({
    puntaje: Joi.number()
      .integer()
      .required()
      //.pattern(/^[0-9]+$/)
      .messages({
        "string.base": "El puntaje debe ser de tipo int.",
        //"string.pattern.base": "El puntaje proporcionado no es un numero",
      }),
  });

  const postulaEstadoSchema = Joi.object({
    estado: Joi.string()
      .valid('Enviada', 'Rechazada', 'Apelada', 'Aprobada')
      .required()
      //.pattern(/^[0-9]+$/)
      .messages({
        "string.base": "El estado debe ser de tipo string.",
        //"string.pattern.base": "El puntaje proporcionado no es un numero",
      }),
  });
module.exports = { postulaPuntajeSchema, postulaEstadoSchema };
