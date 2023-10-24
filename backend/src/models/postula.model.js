"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

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
        required: true,
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
    beca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beca",
        required: true,
    },
    postulante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Postula' */
const Postula = mongoose.model("Postula", postulaSchema);

// Exporta el modelo de datos 'Postula'
module.exports = Postula;
