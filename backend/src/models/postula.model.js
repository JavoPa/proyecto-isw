"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Crea el esquema de la coleccion 'postula'
const postulaSchema = new mongoose.Schema(
  {
    fecha_recepcion: { 
      type: Date, 
      default: Date.now 
    },
    documentosPDF: [
      {
        nombre: String,        // Nombre del archivo PDF
        contenido: Buffer,      // Contenido del archivo PDF en formato binario
      }
    ],
    estado: {
      type: String,
      default: 'Enviado',
    },
    motivos: {
      type: String,
      default: 'Pendiente de revision',
    },
    beca: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beca",
      },
    ],
    postulante: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Postula' */
const Postula = mongoose.model("Postula", postulaSchema);

// Exporta el modelo de datos 'Postula'
module.exports = Postula;
