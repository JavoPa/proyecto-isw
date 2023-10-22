"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'beca'
const becaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    requisitos: {
      type: [String],
      required: true,
    },
    documentos: {
      type: [String],
      required: true,
    },
    fecha_inicio: {
      type: Date,
      required: true,
    },
    fecha_fin: {
      type: Date,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    tipo_pago: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Beca' */
const Beca = mongoose.model("Beca", becaSchema);

// Exporta el modelo de datos 'Beca'
module.exports = Beca;
