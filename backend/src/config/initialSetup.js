"use strict";
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");

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
      new Role({ name: "Postulante" }).save(),
      new Role({ name: "Encargado" }).save(),
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

    const admin = await Role.findOne({ name: "Encargado" });
    const user = await Role.findOne({ name: "Postulante" });

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
        apellidos: null,
        rut: null,
        email: "admin@email.com",
        password: await User.encryptPassword("admin123"),
        roles: admin._id,
      }).save(),
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createRoles,
  createUsers,
};
