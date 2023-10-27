"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler");
const UserService = require("../services/user.service");
const { userBodySchema, userIdSchema } = require("../schema/user.schema");
const { handleError } = require("../utils/errorHandler");
const PostulacionService = require("../services/postulacion.service");
const { postulaPuntajeSchema, postulaEstadoSchema } = require("../schema/postula.schema");
const PDF = require("pdfkit-construct");

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUsers(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsers();
    if (errorUsuarios) return respondError(req, res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsers");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene todos los postulantes
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getPostulantes(req, res) {
  try {
    const [postulantes, errorPostulantes] = await UserService.getPostulantes();
    if (errorPostulantes) return respondError(req, res, 404, errorPostulantes);
    
    postulantes.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, postulantes);
  } catch (error) {
    handleError(error, "user.controller -> getPostulantes");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene un informe con la informacion relevante de cada postulacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getInforme(req, res) {
  try {
    const doc = new PDF({bufferPage: true});
    const filename = `informe-${Date.now()}.pdf`
    const [postulacionesData, error] = await PostulacionService.getPostulaciones();
    if (error) {
      console.error("Hubo un error obteniendo las postulaciones:", error);
      return res.status(500).send(error);
    }

    const postulacionesDataAux = postulacionesData.map(item => ({
      nombreBeca: item.beca.nombre,
      nombrePostulante: item.postulante.nombres,
      apellidosPostulante: item.postulante.apellidos,
      puntaje: item.puntaje
    }));

    //console.log(postulacionesDataAux);

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-dispostion': `attachment;filename=${filename}`
    });

    doc.on('data', (data) => {stream.write(data)});
    doc.on('end', () => {stream.end()});
    
    let datos = [];
    for (let i = 0; i < postulacionesDataAux.length; i++) {
      datos[i] = {
        postulante: `${postulacionesDataAux[i].nombrePostulante} ${postulacionesDataAux[i].apellidosPostulante}`,
        beca: `${postulacionesDataAux[i].nombreBeca}`,
        puntaje: postulacionesDataAux[i].puntaje
      }
    }
    
    doc.setDocumentHeader({
      height: '12'
    }, () => {
      doc.fontSize(14).text("Informe de Becas", {
        //width: "fill_body",
        align: "justify"
      });
    });

    //doc.text("Hola mundo");
    doc.addTable([
      {key: 'postulante', label: 'Postulante', align: 'center'},
      {key: 'beca', label: 'Beca', align: 'center'},
      {key: 'puntaje', label: 'Puntaje', align: 'center'},
    ], datos, {
      border: null,
      width: "fill_body",
      striped: true,
      stripedColors: ["#f6f6f6", "#d6c4dd"],
      cellsPadding: 10,
      marginLeft: 20,
      marginRight: 20,
      headAlign: 'center'
    });
    doc.render();
    doc.end();

  } catch (error) {
    handleError(error, "user.controller -> getInforme");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene los documentos de una postulacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDocuments(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [documents, errorDocuments] = await UserService.getDocuments(params.id);

    if (errorDocuments) return respondError(req, res, 404, errorDocuments);

    respondSuccess(req, res, 200, documents);
  } catch (error) {
    handleError(error, "user.controller -> getDocuments");
    respondError(req, res, 500, "No se pudo obtener los documentos");
  }
}

/**
 * Actualiza el puntaje de una postulacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updatePuntaje(req, res) {
  try {
    const { params, body } = req;
    const { error: bodyError } = postulaPuntajeSchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [postulacion, postulaError] = await UserService.updatePuntaje(params.id, body);
    if (postulaError) return respondError(req, res, 400, postulaError);
    

    respondSuccess(req, res, 200, postulacion);
  } catch (error) {
    handleError(error, "user.controller -> updatePuntaje");
    respondError(req, res, 500, "No se pudo actualizar el puntaje");
  }
}

/**
 * Actualiza el estado de una postulacion por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateEstado(req, res) {
  try {
    const { params, body } = req;
    const { error: bodyError } = postulaEstadoSchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [postulacion, postulaError] = await UserService.updateEstado(params.id, body);
    if (postulaError) return respondError(req, res, 400, postulaError);
    

    respondSuccess(req, res, 200, postulacion);
  } catch (error) {
    handleError(error, "user.controller -> updatePuntaje");
    respondError(req, res, 500, "No se pudo actualizar el puntaje");
  }
}

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createUser(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newUser, userError] = await UserService.createUser(body);

    if (userError) return respondError(req, res, 400, userError);
    if (!newUser) {
      return respondError(req, res, 400, "No se creo el usuario");
    }

    respondSuccess(req, res, 201, newUser);
  } catch (error) {
    handleError(error, "user.controller -> createUser");
    respondError(req, res, 500, "No se creo el usuario");
  }
}

/**
 * Obtiene un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUserById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [user, errorUser] = await UserService.getUserById(params.id);

    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> getUserById");
    respondError(req, res, 500, "No se pudo obtener el usuario");
  }
}

/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [user, userError] = await UserService.updateUser(params.id, body);

    if (userError) return respondError(req, res, 400, userError);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> updateUser");
    respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}

/**
 * Elimina un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteUser(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const user = await UserService.deleteUser(params.id);
    !user
      ? respondError(
          req,
          res,
          404,
          "No se encontro el usuario solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> deleteUser");
    respondError(req, res, 500, "No se pudo eliminar el usuario");
  }
}

module.exports = {
  getUsers,
  getPostulantes,
  getInforme,
  getDocuments,
  updatePuntaje,
  updateEstado,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
