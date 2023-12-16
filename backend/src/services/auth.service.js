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

function isValidRut(rut) {
  // Convertir el RUT a cadena y eliminar puntos y guiones
  const cleanRut = String(rut);

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const rutDV = cleanRut.slice(-1).toUpperCase();

  // Calcular el dígito verificador
  const calculatedDV = calculateRutDV(rutNumber);
  const calculatedDVString = String(calculatedDV);
  // Comparar con el dígito verificador proporcionado
  if (calculatedDVString === rutDV) {
    return true;
  }
  return false;
}

function calculateRutDV(rutNumber) {
  let sum = 0;
  let multiplier = 2;

  // Recorrer el RUT de derecha a izquierda y aplicar la fórmula
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  // Calcular el módulo 11
  const remainder = sum % 11;

  if (remainder === 0) {
    return 0;
  } else if (remainder === 1) {
    return 0;
  } else {
    return 11 - remainder;
  }
}



async function register(user) {
  try {
    const { nombres, apellidos, rut, password, email, direccion, telefono, fecha_nacimiento, sexo, discapacidad, cuenta_bancaria } = user;

    const rutExistente = await User.findOne({ rut: rut }).exec();
    if (rutExistente) return [null, "rut ya está registrado"];

    // Validación del RUT
    if (!isValidRut(rut)) {
      return [null, "RUT no válido"];
    }

    const emailExistente = await User.findOne({ email: email }).exec();
    if (emailExistente) return [null, "email ya está registrado"];
   

    const rol = await Role.findOne({ name: "postulante"}).exec();

    // Split the date by '-'
    const parts = fecha_nacimiento.split('-');
    
    // Rearrange the parts to the desired format YYYY-MM-DD
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const newUser = new User({
      nombres: nombres,
      apellidos: apellidos,
      rut: rut,
      password: await User.encryptPassword(password),
      email: email,
      roles: rol,
      direccion: direccion,
      telefono: telefono,
      fecha_nacimiento: formattedDate,
      sexo: sexo,
      discapacidad: discapacidad,
      cuenta_bancaria: cuenta_bancaria,
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
