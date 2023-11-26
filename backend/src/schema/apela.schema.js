"use strict";

const Joi = require("joi");

const actualizaEstado = Joi.object({
    estado: Joi.string()
      .valid('Pendiente', 'Aceptada', 'Rechazada')
      .required()
      .messages({
        "string.base": "El estado debe ser de tipo string.",
        "any.required": "El estado es obligatorio.",
        "string.empty": "El estado no puede estar vacio.",
        "string.valid": "El estado debe ser uno válido.",
      }),
    motivos: Joi.string()
      .required()
      .messages({
        "string.empty": "El motivo no puede estar vacio.",
        "any.required": "El motivo es obligatorio.",
        "string.base": "El motivo debe ser de tipo string.",
      }),
});

module.exports = {actualizaEstado};