"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Crea el esquema de la coleccion 'beca'
const requisitoSchema = new mongoose.Schema(
  {
    descripcion: {
        type: String,
        required: true,
        unique: true,
    },
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Beca' */
const Requisito = mongoose.model("Requisito", requisitoSchema);

// Exporta el modelo de datos 'Beca'
module.exports = Requisito;
