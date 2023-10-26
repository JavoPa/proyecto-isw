"use strict";
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
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
        rut: 12345678,
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
        nombre: "Beca excelencia academica colegio",
        requisitos: [1,2],
        documentos: ["Fotocopia de cedula de identidad", "Certificado de alumno regular", "Certificado de notas"],
        fecha_inicio: "2023-11-01",
        fecha_fin: "2023-11-31",
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
    if (!beca) return;
    const postulante = await User.findOne({ rut: 39444789 }).select("_id").exec();
    if (!postulante) return;
    const postulante2 = await User.findOne({ rut: 92837465 }).select("_id").exec();
    if (!postulante2) return;

    await Promise.all([
      new Postula({
        fecha_recepcion: "2021-01-02",
        estado: "Enviada",
        beca: beca,
        postulante: postulante,
      }).save()
    ]);
    await Promise.all([
      new Postula({
        fecha_recepcion: "2021-01-03",
        estado: "Rechazada",
        beca: beca,
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
