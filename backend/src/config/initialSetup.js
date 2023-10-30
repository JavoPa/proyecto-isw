"use strict";
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const User = require("../models/user.model.js");
const Postula = require("../models/postula.model.js");
const Beca = require("../models/beca.model.js");
const Requisito = require("../models/requisitos.model.js");
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
        nombres: "Sebastian",
        apellidos: "Velastegui",
        rut: 20484871,
        email: "sebastian@email.com",
        password: await User.encryptPassword("user123"),
        roles: user._id
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
        nombre: "Beca excelencia estudiantil colegio",
        requisitos: [1,2],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)","Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes de enseñanza basica"],
        monto: 50000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca excelencia estudiantil liceo",
        requisitos: [1,2],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes de enseñanza media"],
        monto: 100000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca excelencia estudiantil universidad",
        requisitos: [1,2],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes universitarios"],
        monto: 150000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca discapacidad",
        requisitos: [3],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de discapacidad"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Personas con alguna discapacidad"],
        monto: 250000,
        tipo_pago: "Cada 4 meses",
      }).save(),
      new Beca({
        nombre: "Beca de residencia",
        requisitos: [4,5],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de residencia","Contrato de arriendo", "Certificado de alumno regular"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes con arriendo"],
        monto: 100000,
        tipo_pago: "Pago mensual durante 10 meses",
      }).save(),
      new Beca({
        nombre: "Beca subsidio pagos basicos",
        requisitos: [6,7],
        documentos: ["Fotocopia de cedula de identidad (ambos lados) del jefe de hogar", "Ficha social de hogares","liquidacion de sueldo (ultimos 3 meses)"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Personas pertenecientes al 60% mas vulnerable del pais"],
        monto: 0,
        tipo_pago: "Pago mensual",
      }).save(),
      new Beca({
        nombre: "Beca ayuda adulto mayor",
        requisitos: [8],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)"],
        fecha_inicio: moment("01-01-2024", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-01-2024", "DD-MM-YYYY").toDate(),
        dirigida:["Personas pertenecientes al 60% mas vulnerable del pais"],
        monto: 150000,
        tipo_pago: "Pago mensual",
      }).save(),
    ]);
    console.log("* => Becas creadas exitosamente");
  } catch (error) {
    console.error(error);
  }
}

async function createRequisitos() {
  try {
    const count = await Requisito.estimatedDocumentCount();
    if (count > 0) return;
    await Promise.all([
      new Requisito({
        descripcion: "Ser estudiante regular",
        codigo: 1,
      }).save(),
      new Requisito({
        descripcion: "Tener promedio de notas igual o mayor a 6",
        codigo: 2,
      }).save(),
      new Requisito({
        descripcion: "Presentar alguna discapacidad",
        codigo: 3,
      }).save(),
      new Requisito({
        descripcion: "Ser estudiante que su hogar familiar se encuentre fuera de la ciudad de estudio",
        codigo: 4,
      }).save(),
      new Requisito({
        descripcion: "Poseer contrato de arriendo",
        codigo: 5,
      }).save(),
      new Requisito({
        descripcion: " Estar registrado en el Registro social de hogares",
        codigo: 6,
      }).save(),
      new Requisito({
        descripcion: "Pertenecer al 60% más vulnerable del país",
        codigo: 7,
      }).save(),
      new Requisito({
        descripcion: "Tener 65 años o más",
        codigo: 8,
      }).save(),
    ]);
    console.log("* => Requisitos creados exitosamente");
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
    const beca = await Beca.findOne({ nombre: "Beca excelencia estudiantil colegio" }).select("_id").exec();
    const beca2 = await Beca.findOne({ nombre: "Beca discapacidad" }).select("_id").exec();
    if (!beca) return;

    const postulante = await User.findOne({ rut: 39444789 }).select("_id").exec();
    if (!postulante) return;
    const postulante2 = await User.findOne({ rut: 92837465 }).select("_id").exec();
    if (!postulante2) return;

    const beca1 = await Beca.findOne({ nombre: "Beca excelencia academica universidad" }).select("_id").exec();
    if (!beca1) return;

    const postulante1 = await User.findOne({ rut: 20484871 }).select("_id").exec();
    if (!postulante1) return;

    await Promise.all([
      new Postula({
        fecha_recepcion: moment("02-01-2023", "DD-MM-YYYY").toDate(),
        estado: "Enviada",
        beca: beca,
        postulante: postulante,
        puntaje: 0
      }).save(),
      new Postula({
        fecha_recepcion: "2021-01-02",
        estado: "Enviada",
        beca: beca1,
        postulante: postulante1,
        puntaje: 0
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
  createRequisitos,
  createPostulaciones,
};
