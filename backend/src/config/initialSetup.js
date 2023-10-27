"use strict";
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
const moment = require("moment");
/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "postulante" }).save(),
      new Role({ name: "encargado" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "encargado" });
    const user = await Role.findOne({ name: "postulante" });

    await Promise.all([
      new User({
        nombres: "user",
        apellidos: "apellido",
        rut: 123456789,
        email: "user@email.com",
        password: await User.encryptPassword("user123"),
        roles: user._id,
      }).save(),
      new User({
        nombres: "admin",
        apellidos: "admin",
        rut: 1111111,
        email: "admin@email.com",
        password: await User.encryptPassword("admin123"),
        roles: admin._id,
      }).save(),
      new User({
        nombres: "Ricardo",
        apellidos: "Gonzalez",
        rut: 39444789,
        email: "ricardo@email.com",
        password: await User.encryptPassword("user123"),
        roles: user._id,
      }).save(),
      new User({
        nombres: "Fernanda",
        apellidos: "Mendez",
        rut: 92837465,
        email: "fernanda@email.com",
        password: await User.encryptPassword("user123"),
        roles: user._id,
      }).save(),
      new User({
        nombres: "Juan",
        apellidos: "Perez",
        rut: 23985023,
        email: "juan@email.com",
        password: await User.encryptPassword("juan123"),
        roles: user._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea las becas por defecto en la base de datos.
 * @async
 * @function createBecas
 * @returns {Promise<void>}
 */
async function createBecas() {
  try {
    const count = await Beca.estimatedDocumentCount();
    if (count > 0) return;

    await Promise.all([
      new Beca({
        nombre: "Beca discapacidad",
        requisitos: [1],
        documentos: ["Fotocopia de cedula de identidad"],
        fecha_inicio: moment("20-10-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("26-10-2023", "DD-MM-YYYY").toDate(),
        monto: 50000,
        tipo_pago: "1 pago al año",
      }).save()
    ]);
    await Promise.all([
      new Beca({
        nombre: "Beca excelencia academica colegio",
        requisitos: [1,2],
        documentos: ["Fotocopia de cedula de identidad", "Certificado de alumno regular", "Certificado de notas"],
        fecha_inicio: moment("01-01-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2023", "DD-MM-YYYY").toDate(),
        monto: 50000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save()
    ]);
    console.log("* => Becas creadas exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea las postulaciones por defecto en la base de datos.
 * @async
 * @function createPostulaciones
 * @returns {Promise<void>}
 */
async function createPostulaciones() {
  try {
    const count = await Postula.estimatedDocumentCount();
    if (count > 0) return;
    const beca = await Beca.findOne({ nombre: "Beca excelencia academica colegio" }).select("_id").exec();
    const beca2 = await Beca.findOne({ nombre: "Beca discapacidad" }).select("_id").exec();
    if (!beca) return;
    const postulante = await User.findOne({ rut: 39444789 }).select("_id").exec();
    if (!postulante) return;
    const postulante2 = await User.findOne({ rut: 92837465 }).select("_id").exec();
    if (!postulante2) return;

    await Promise.all([
      new Postula({
        fecha_recepcion: moment("02-01-2023", "DD-MM-YYYY").toDate(),
        estado: "Enviada",
        beca: beca,
        postulante: postulante,
      }).save()
    ]);
    await Promise.all([
      new Postula({
        fecha_recepcion: moment("03-01-2023", "DD-MM-YYYY").toDate(),
        estado: "Rechazada",
        beca: beca2,
        postulante: postulante2,
      }).save()
    ]);
    console.log("* => Postulaciones creadas exitosamente");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createRoles,
  createUsers,
  createBecas,
  createPostulaciones,
};
