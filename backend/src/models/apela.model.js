"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'postula'
const apelaSchema = new mongoose.Schema(
  {
    estado: {
      type: String,
      enum: ["En revisión", "Aceptada", "Rechazada"],
      default: "En revisión",
    },
    fecha_apelacion: {
      type: Date,
      default: Date.now
    },
    documentosPDF: [
      {
        nombre: String,
        contenido: Buffer,
      }
    ],
    postulacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Postula",
    },
    motivo: { // Motivo del postulante para apelar
      type: String,
    },
    motivos: { // Motivos del estado de la apelacion
      type: String,
      default: "Pendiente de revision",
    }
  },
  {
    versionKey: false,
  },
);

/** Modelo de datos 'Postula' */
const Apela = mongoose.model("Apela", apelaSchema);

// Exporta el modelo de datos 'Apela'
module.exports = Apela;
