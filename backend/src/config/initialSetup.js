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


async function createRequisitos() {
  try {
    const count = await Requisito.estimatedDocumentCount();
    if (count > 0) return;
    await Promise.all([
      new Requisito({
        descripcion: "Ser estudiante regular",
      }).save(),
      new Requisito({
        descripcion: "Tener promedio de notas igual o mayor a 6",
      }).save(),
      new Requisito({
        descripcion: "Presentar alguna discapacidad",
      }).save(),
      new Requisito({
        descripcion: "Ser estudiante que su hogar familiar se encuentre fuera de la ciudad de estudio",
      }).save(),
      new Requisito({
        descripcion: "Poseer contrato de arriendo",
      }).save(),
      new Requisito({
        descripcion: "Estar registrado en el Registro social de hogares",
      }).save(),
      new Requisito({
        descripcion: "Pertenecer al 60% más vulnerable del país",
      }).save(),
      new Requisito({
        descripcion: "Tener 65 años o más",
      }).save(),
    ]);
    console.log("* => Requisitos creados exitosamente");
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
    const requisito1 = await Requisito.findOne({ descripcion: "Ser estudiante regular" }).select("_id").exec();
    const requisito2 = await Requisito.findOne({ descripcion: "Tener promedio de notas igual o mayor a 6" }).select("_id").exec();
    const requisito3 = await Requisito.findOne({ descripcion: "Presentar alguna discapacidad" }).select("_id").exec();
    const requisito4 = await Requisito.findOne({ descripcion: "Ser estudiante que su hogar familiar se encuentre fuera de la ciudad de estudio" }).select("_id").exec();
    const requisito5 = await Requisito.findOne({ descripcion: "Poseer contrato de arriendo" }).select("_id").exec();
    const requisito6 = await Requisito.findOne({ descripcion: "Estar registrado en el Registro social de hogares" }).select("_id").exec();
    const requisito7 = await Requisito.findOne({ descripcion: "Pertenecer al 60% más vulnerable del país" }).select("_id").exec();
    const requisito8 = await Requisito.findOne({ descripcion: "Tener 65 años o más" }).select("_id").exec();

    const count = await Beca.estimatedDocumentCount();
    if (count > 0) return;
    await Promise.all([
      new Beca({
        nombre: "Beca excelencia estudiantil colegio",
        requisitos: [requisito1._id.toString(), requisito2._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)","Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("14-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("28-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes de enseñanza basica"],
        monto: 50000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca excelencia estudiantil liceo",
        requisitos: [requisito1._id.toString(), requisito2._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("01-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("15-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes de enseñanza media"],
        monto: 100000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca excelencia estudiantil universidad",
        requisitos: [requisito1._id.toString(), requisito2._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de alumno regular", "Certificado de notas año anterior"],
        fecha_inicio: moment("01-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("15-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes universitarios"],
        monto: 150000,
        tipo_pago: "2 pagos al año (cada semestre)",
      }).save(),
      new Beca({
        nombre: "Beca discapacidad",
        requisitos: [requisito3._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de discapacidad"],
        fecha_inicio: moment("01-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("15-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Personas con alguna discapacidad"],
        monto: 250000,
        tipo_pago: "Cada 4 meses",
      }).save(),
      new Beca({
        nombre: "Beca de residencia",
        requisitos: [requisito4._id.toString(), requisito5._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)", "Certificado de residencia","Contrato de arriendo", "Certificado de alumno regular"],
        fecha_inicio: moment("01-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("14-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Estudiantes con arriendo"],
        monto: 100000,
        tipo_pago: "Pago mensual durante 10 meses",
      }).save(),
      new Beca({
        nombre: "Beca subsidio pagos basicos",
        requisitos: [requisito5._id.toString(), requisito6._id.toString(), requisito7._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados) del jefe de hogar", "Ficha social de hogares","liquidacion de sueldo (ultimos 3 meses)"],
        fecha_inicio: moment("14-12-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("28-12-2023", "DD-MM-YYYY").toDate(),
        dirigida:["Personas pertenecientes al 60% mas vulnerable del pais"],
        monto: 0,
        tipo_pago: "Pago mensual",
      }).save(),
      new Beca({
        nombre: "Beca ayuda adulto mayor",
        requisitos: [requisito8._id.toString()],
        documentos: ["Fotocopia de cedula de identidad (ambos lados)"],
        fecha_inicio: moment("18-01-2023", "DD-MM-YYYY").toDate(),
        fecha_fin: moment("01-01-2024", "DD-MM-YYYY").toDate(),
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
    const beca_excelencia_colegio = await Beca.findOne({ nombre: "Beca excelencia estudiantil colegio" }).select("_id").exec();
    const beca_discapacidad = await Beca.findOne({ nombre: "Beca discapacidad" }).select("_id").exec();
    const beca_excelencia_universidad = await Beca.findOne({ nombre: "Beca excelencia estudiantil universidad" }).select("_id").exec();
    if (!beca_excelencia_colegio || !beca_discapacidad || !beca_excelencia_universidad) return;

    const postulante_ricardo = await User.findOne({ rut: 39444789 }).select("_id").exec();
    if (!postulante_ricardo) return;
    const postulante_sebastian = await User.findOne({ rut: 20484871 }).select("_id").exec();
    if (!postulante_sebastian) return;
    const postulante_fernanda = await User.findOne({ rut: 92837465 }).select("_id").exec();
    if (!postulante_fernanda) return;

    await Promise.all([
      new Postula({
        fecha_recepcion: moment("15-12-2023", "DD-MM-YYYY").toDate(),
        estado: "Enviada",
        beca: beca_excelencia_colegio,
        postulante: postulante_ricardo,
        puntaje: 0
      }).save(),
      new Postula({
        fecha_recepcion: moment("10-12-2023", "DD-MM-YYYY").toDate(),
        estado: "Aprobada",
        beca: beca_excelencia_universidad,
        postulante: postulante_sebastian,
        puntaje: 0
      }).save()
    ]);
    await Promise.all([
      new Postula({
        fecha_recepcion: moment("03-12-2023", "DD-MM-YYYY").toDate(),
        estado: "Rechazada",
        beca: beca_discapacidad,
        postulante: postulante_fernanda,
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
