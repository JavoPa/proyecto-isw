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
        "any.only": "El estado debe ser 'Pendiente', 'Aceptada' o 'Rechazada'.",
      }),
    motivos: Joi.string()
      .pattern(/^[a-zA-Z\s]*$/, 'letters and spaces')
      .required()
      .messages({
        "string.empty": "El motivo no puede estar vacio.",
        "any.required": "El motivo es obligatorio.",
        "string.base": "El motivo debe ser de tipo string.",
        "string.pattern.name": "El motivo solo debe contener letras y espacios.",
      }),
});

const creaApelacion = Joi.object({
  motivo: Joi.string()
    .pattern(/^[a-zA-Z\s]*$/, 'letters and spaces')
    .required()
    .messages({
      "string.empty": "El motivo no puede estar vacio.",
      "any.required": "El motivo es obligatorio.",
      "string.base": "El motivo debe ser de tipo string.",
      "string.pattern.name": "El motivo solo debe contener letras y espacios.",
    }),
});

module.exports = {actualizaEstado, creaApelacion};