"use strict";
// Importa el modelo de datos 'User'
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const { handleError } = require("../utils/errorHandler");
const Postula = require("../models/postula.model.js");

/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getUsers() {
  try {
    const users = await User.find()
      .select("-password")
      .populate("roles")
      .exec();
    if (!users) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsers");
  }
}

/**
 * Obtiene los documentos de una postulacion segun su id
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de documento
 */
async function getDocuments(id) {
  try {
    const documents = await Postula.findById(id)
      .select("documentosPDF")
      .exec();
    //console.log(documents.documentosPDF.length);
    if (!documents) return [null, "No hay documentos"];
    if (documents.documentosPDF.length === 0) return [null, "No hay documentos en esta postulación"];

    return [documents, null];
  } catch (error) {
    handleError(error, "postulacion.service -> getEstado");
  }
}

/**
 * Obtiene solo a los postulantes (quienes no tengan el rol de administrador)
 * @returns {Promise} Promesa con el objeto de los postulantes
 */
async function getPostulantes() {
  try {
    const postulantes = [];
    const postulaciones = await Postula.find()
      .select("postulante")
      .exec();

    for (let i = 0; i < postulaciones.length; i++) {
      const userAux = await User.findById(postulaciones[i].postulante);
    postulantes.push(userAux);
    }

    if (!postulantes) return [null, "No hay postulantes"];

    return [postulantes, null];
  } catch (error) {
    handleError(error, "user.service -> getPostulantes");
  }
}

/**
 * Actualiza el puntaje de una postulacion por su id
 * @param {string} id de la postulacion
 * @param {Object} body objeto de body con puntaje a asignar
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updatePuntaje(id, body) {
  try {
    const postulacionFound = await Postula.findById(id);
    if (!postulacionFound) return [null, "La postulacion no existe"];

    const postulacionUpdated = await Postula.findByIdAndUpdate(
      id,
      {
        puntaje: body.puntaje
      },
      { new: true },
    );

    return [postulacionUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updatePuntaje");
  }
}

/**
 * Actualiza el puntaje de una postulacion por su id
 * @param {string} id de la postulacion
 * @param {Object} body objeto de body con estado a asignar
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updateEstado(id, body) {
  try {
    const postulacionFound = await Postula.findById(id);
    if (!postulacionFound) return [null, "La postulacion no existe"];

    const postulacionUpdated = await Postula.findByIdAndUpdate(
      id,
      {
        estado: body.estado
      },
      { new: true },
    );

    return [postulacionUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateEstado");
  }
}

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createUser(user) {
  try {
    const { username, email, password, roles } = user;

    const userFound = await User.findOne({ email: user.email });
    if (userFound) return [null, "El usuario ya existe"];

    const rolesFound = await Role.find({ name: { $in: roles } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];
    const myRole = rolesFound.map((role) => role._id);

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      roles: myRole,
    });
    await newUser.save();

    return [newUser, null];
  } catch (error) {
    handleError(error, "user.service -> createUser");
  }
}

/**
 * Obtiene un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario
 */
async function getUserById(id) {
  try {
    const user = await User.findById({ _id: id })
      .select("-password")
      .populate("roles")
      .exec();

    if (!user) return [null, "El usuario no existe"];

    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserById");
  }
}

/**
 * Actualiza un usuario por su id en la base de datos
 * @param {string} id Id del usuario
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function updateUser(id, user) {
  try {
    const userFound = await User.findById(id);
    if (!userFound) return [null, "El usuario no existe"];

    const { username, email, password, newPassword, roles } = user;

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, "La contraseña no coincide"];
    }

    const rolesFound = await Role.find({ name: { $in: roles } });
    if (rolesFound.length === 0) return [null, "El rol no existe"];

    const myRole = rolesFound.map((role) => role._id);

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        username,
        email,
        password: await User.encryptPassword(newPassword || password),
        roles: myRole,
      },
      { new: true },
    );

    return [userUpdated, null];
  } catch (error) {
    handleError(error, "user.service -> updateUser");
  }
}

/**
 * Elimina un usuario por su id de la base de datos
 * @param {string} Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario eliminado
 */
async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "user.service -> deleteUser");
  }
}

module.exports = {
  getUsers,
  getPostulantes,
  getDocuments,
  updatePuntaje,
  updateEstado,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
