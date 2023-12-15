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
  requisitos: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Los requisitos deben ser de tipo array.",
    "any.required": "Los requisitos son obligatorios.",
    "string.base": "Cada requisito debe ser un número entero.",
  }),
  documentos: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Los documentos deben ser de tipo array.",
    "any.required": "Los documentos son obligatorios.",
    "string.base": "Cada documento debe ser de tipo string.",
  }),
  fecha_inicio: Joi.string()
  .regex(/^\d{2}-\d{2}-\d{4}$/)
  .required()
  .messages({
    "string.pattern.base": "La fecha debe tener el formato DD-MM-YYYY.",
    "any.required": "La fecha es obligatoria.",
  }),
  fecha_fin: Joi.string()
  .regex(/^\d{2}-\d{2}-\d{4}$/)
  .required()
  .messages({
    "string.pattern.base": "La fecha debe tener el formato DD-MM-YYYY.",
    "any.required": "La fecha es obligatoria.",
  }),
  dirigida: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Para quienes son debe ser de tipo array.",
    "any.required": "Para quienes son es obligatorio.",
    "string.base": "Para quienes son debe ser de tipo string.",
  }),
  monto: Joi.alternatives().try(
    Joi.number().integer().positive().messages({
      "number.base": "El monto debe ser un número entero positivo.",
    }),
    Joi.string().regex(/^(\d+(\.\d{0,2})?%$)/).messages({
      "string.pattern.base": "El monto debe ser un porcentaje válido en formato numérico (por ejemplo, '25%' o '0.25%').",
    })
  ).required().messages({
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