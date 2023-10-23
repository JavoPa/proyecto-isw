"use strict";

const Joi = require("joi");
const mongoose = require("mongoose");

// Define el esquema de validación para el modelo Beca
const becaSchema = Joi.object({
  nombre: Joi.string().required().min(5).messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener al menos 5 caracteres.",
  }),
  requisitos: Joi.array().items(Joi.number().integer().positive()).required().messages({
    "array.base": "Los requisitos deben ser de tipo array.",
    "any.required": "Los requisitos son obligatorios.",
    "number.base": "Cada requisito debe ser un número entero.",
  }),
  documentos: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Los documentos deben ser de tipo array.",
    "any.required": "Los documentos son obligatorios.",
    "string.base": "Cada documento debe ser de tipo string.",
  }),
  fecha_inicio: Joi.date().iso().required().messages({
    "date.base": "La fecha de inicio debe ser de tipo Date.",
    "date.format": "La fecha de inicio debe ser de tipo Date YYYY-MM-DD.",
    "any.required": "La fecha de inicio es obligatoria.",
  }),
  fecha_fin: Joi.date().required().messages({
    "date.base": "La fecha de fin debe ser de tipo Date.",
    "any.required": "La fecha de fin es obligatoria.",
  }),
  monto: Joi.number().integer().positive().required().messages({
    "number.base": "El monto debe ser de tipo número.",
    "any.required": "El monto es obligatorio.",
  }),
  tipo_pago: Joi.string().required().min(5).messages({
    "string.empty": "El tipo de pago no puede estar vacío.",
    "string.base": "El tipo de pago debe ser de tipo string.",
    "string.min": "El tipo de pago debe tener al menos 5 caracteres.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

module.exports = becaSchema;