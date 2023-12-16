"use strict";

const Joi = require("joi");
const mongoose = require("mongoose");

// Define el esquema de validación para el modelo Beca
const becaSchema = Joi.object({
  nombre: Joi.string().required().min(5).pattern(/^[a-zA-Z0-9\s]+$/).messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener al menos 5 caracteres.",
    "string.pattern.base": "El nombre no puede contener símbolos ni caracteres especiales.",
  }),
  
  requisitos: Joi.array().items(Joi.string()
  .pattern(/^[a-zA-Z0-9\s]+$/)
  .min(24)
  .messages({
    "string.empty": "El requisito no puede estar vacio.",
    "string.base": "El requisito debe ser de tipo string.",
    "string.pattern.base": "No puedes ingresar requisitos invalidos",
    "string.min": "El requisito debe de existir",
  })).min(1).messages({
    "array.base": "Los requisiros deben ser de tipo array.",
    "array.min": "Debes de ingresar al menos un requisito.",
  }),


  documentos: Joi.array().items(Joi.string()
  .pattern(/^[a-zA-Z\s]*$/, 'letters and spaces')
  .min(4)
  .messages({
    "string.empty": "El nombre del documento no puede estar vacio.",
    "any.required": "El nombre del documento es obligatorio.",
    "string.base": "El nombre del documento debe ser de tipo string.",
    "string.pattern.name": "Los documentos solo deben contener letras y espacios.",
    "string.min": "El documento debe tener al menos 4 caracteres",
  })).min(1).messages({
    "array.base": "Los documentos deben ser de tipo array.",
    "array.min": "Debes de ingresar al menos un documento.",
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
  dirigida: Joi.array().items(Joi.string()
  .pattern(/^[a-zA-Z0-9\s]+$/)
  .messages({
    "string.empty": "Debe ir dirigida a alguien .",
    "string.base": "A quien va dirigida debe ser de tipo string.",
    "string.pattern.base": "Debe ir dirigida a alguien valida",
  })).min(1).messages({
    "array.base": "A quien va dirigida debe ser de tipo array.",
    "array.min": "Debes de ingresar al menos un dato",
  }),
  monto: Joi.alternatives().try(
    Joi.number().integer().positive().messages({
      "number.base": "El monto debe ser un número entero positivo.",
      "number.positive": "El monto debe ser un número entero positivo.",
    }),
    Joi.string().regex(/^(\d+(\.\d{0,2})?%$)/).messages({
      "string.pattern.base": "El monto debe ser un porcentaje o numero valido",
    })
  ).required().messages({
    "any.required": "El monto es obligatorio.",
  }),

  tipo_pago: Joi.string().required().min(5).pattern(/^[a-zA-Z0-9\s]+$/).messages({
    "string.empty": "El tipo de pago no puede estar vacío.",
    "string.base": "El tipo de pago debe ser de tipo string.",
    "string.min": "El tipo de pago debe tener al menos 5 caracteres.",
    "string.pattern.base": "El tipo de pago no puede contener símbolos ni caracteres especiales.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});


/**
 * Esquema de validación para el id de usuario.
 * @constant {Object}
 */
const BecasIdSchema = Joi.object({
  _id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});
module.exports = {becaSchema, BecasIdSchema};