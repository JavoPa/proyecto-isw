"use strict";

const Joi = require("joi");

const postulacionSchema = Joi.object({
    fecha_recepcion: Joi.date().required().messages({
        "string.empty": "La fecha no puede estar vacía.",
        "any.required": "La fecha es obligatoria.",
        "string.base": "La fecha debe ser de tipo string.",
    }),
    documentosPDF: Joi.array().items(Joi.object({
        nombre: Joi.string().required().messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio.",
            "string.base": "El nombre debe ser de tipo string.",
        }),
        contenido: Joi.string().required().messages({
            "string.empty": "El contenido no puede estar vacío.",
            "any.required": "El contenido es obligatorio.",
            "string.base": "El contenido debe ser de tipo string.",
        }),
    })).required().messages({
        "array.base": "El documento debe ser de tipo array.",
        "any.required": "El documento es obligatorio.",
    }),
    estado: Joi.string().required().messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
    }),
    motivos: Joi.string().required().messages({
        "string.empty": "El motivo no puede estar vacío.",
        "any.required": "El motivo es obligatorio.",
        "string.base": "El motivo debe ser de tipo string.",
    }),
    beca: Joi.string().required().messages({
        "string.empty": "La beca no puede estar vacía.",
        "any.required": "La beca es obligatoria.",
        "string.base": "La beca debe ser de tipo string.",
    }),
    postulante: Joi.string().required().messages({
        "string.empty": "El postulante no puede estar vacío.",
        "any.required": "El postulante es obligatorio.",
        "string.base": "El postulante debe ser de tipo string.",
    }),

});


  
module.exports = { postulacionSchema };