"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Crea el esquema de la coleccion 'usuarios'
const userSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    rut: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    telefono: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fecha_nacimiento: {
      type: Date,
      required: true,
    },
    sexo: {
      type: String,
      required: true,
    },
    discapacidad: {
      type: Boolean,
      required: true,
    },
    cuenta_bancaria: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    versionKey: false,
  },
);

/** Encripta la contraseña del usuario */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compara la contraseña del usuario */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** Modelo de datos 'User' */
const User = mongoose.model("User", userSchema);

// Exporta el modelo de datos 'User'
module.exports = User;
