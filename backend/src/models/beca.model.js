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
    requisitos: [{
      type: Number,
      ref: 'Requisito' // Referencia al modelo de "Requisito"
    }],
    documentos: {
      type: [String],
    },
    fecha_inicio: {
      type: Date,
      required: true,
    },
    fecha_fin: {
      type: Date,
      required: true,
    },
    dirigida:{
      type:[String],
    },
    monto: {
      type: mongoose.Schema.Types.Mixed,
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
