"use strict";

/** Modelo de datos 'User' */
const User = require("../models/user.model.js");

/**roles que puede tener un usuario*/ 
const ROLES = require("../constants/roles.constants");

/** Modelo de datos 'Role' */
const Role = require("../models/role.model.js");

/** Modulo 'jsonwebtoken' para crear tokens */
const jwt = require("jsonwebtoken");

const {
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
} = require("../config/configEnv.js");

const { handleError } = require("../utils/errorHandler");

async function register(user) {
  try {
    const { nombres, apellidos, rut, password, email } = user;

    const rutExistente = await User.findOne({ rut: rut }).exec();
    if (rutExistente) return [null, "rut ya está registrado"];

    const emailExistente = await User.findOne({ email: email }).exec();
    if (emailExistente) return [null, "email ya está registrado"];
    /*
    const rutformat = /^[0-9]+-[0-9kK]{1}$/;
    if (!rutformat.test(rut)) {
      throw new Error("El formato del rut no es válido.");
    }
*/
    const rol = await Role.findOne({ name: "postulante"}).exec();
      
    const newUser = new User({
      nombres: nombres,
      apellidos: apellidos,
      rut: rut,
      password: await User.encryptPassword(password),
      email: email,
      roles: rol,
    });

    await newUser.save();

    return [newUser, null];

  } catch (error) {
    handleError(error, "auth.service -> registerUser");
  }
}

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;

    const userFound = await User.findOne({ email: email })
      .populate("roles")
      .exec();
    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email: userFound.email, roles: userFound.roles, _id: userFound._id },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> signIn");
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesion a caducado, vuelva a iniciar sesion"];

        const userFound = await User.findOne({
          email: user.email,
        })
          .populate("roles")
          .exec();

        if (!userFound) return [null, "No usuario no autorizado"];

        const accessToken = jwt.sign(
          { email: userFound.email, roles: userFound.roles },
          ACCESS_JWT_SECRET,
          {
            expiresIn: "1d",
          },
        );

        return [accessToken, null];
      },
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
  }
}

module.exports = {
  register,
  login,
  refresh,
};
