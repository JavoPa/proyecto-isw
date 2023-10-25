"use strict";
const { respondSuccess, respondError } = require("../utils/resHandler");
const postulacionService = require("../services/postulacion.service");
const { handleError } = require("../utils/errorHandler");


async function getBecasPostulacion(req, res) {
    try {
        const [becas, errorBecas] = await postulacionService.getBecasPostulacion();
        if (errorBecas) return respondError(req, res, 404, errorBecas);
    
        becas.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, becas);
    } catch (error) {
        handleError(error, "postulacion.controller -> getBecasPostulacion");
        respondError(req, res, 400, error.message);
    }
    }

module.exports = {
    getBecasPostulacion,
};