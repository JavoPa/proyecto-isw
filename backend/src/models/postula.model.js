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
      }
    ],
    estado: {
      type: String,
      enum: ['Enviada', 'Rechazada', 'Aprobada'],
      default: 'Enviado',
    },
    motivos: {
      type: String,
      default: 'Pendiente de revision',
    },
    beca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beca",
    },
    postulante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    puntaje: {
      type: Number,
      default: 0
    },
    comentario: {
      type: String,
    },
    documentosFaltantes: [ // String con los documentos faltantes en caso de ser rechazada
    {
      type: String,
    }
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
