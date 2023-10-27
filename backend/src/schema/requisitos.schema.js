"use strict";

const Joi = require("joi");
const mongoose = require("mongoose");

// Define el esquema de validación para el modelo Requisito
const requisitoSchema = Joi.object({
  descripcion: Joi.string().required().min(5).messages({
    "string.empty": "La descipción no puede estar vacía.",
    "any.required": "La descripción es obligatorio.",
    "string.base": "La descripción debe ser de tipo string.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
  }),
  codigo: Joi.number().integer().positive().required().messages({
    "number.base": "El codigo debe ser de tipo número.",
    "any.required": "El codigo es obligatorio.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = requisitoSchema;