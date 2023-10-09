"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      type: Date,
    },
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'User' */
const Beca = mongoose.model("Beca", becaSchema);

// Exporta el modelo de datos 'User'
module.exports = Beca;
