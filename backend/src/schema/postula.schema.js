"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de apelacion.
 * @constant {Object}
 */
const apelaBodySchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.empty": "El archivo no puede estar vacío.",
    "any.required": "El archivo es obligatorio.",
    "string.base": "El nombre del archivo debe ser de tipo string.",
  }),
  contenido: Joi.binary().required().messages({
    "string.empty": "El archivo no puede estar vacío.",
    "any.required": "El archivo es obligatorio.",
    "string.base": "El archivo debe ser valido.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = { apelaBodySchema };
