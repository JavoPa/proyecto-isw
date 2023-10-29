"use strict";
const Item = require("../models/Item");
const path = require("path");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    console.log(error);
  }
};

const addItem = asyncWrapper(async (req, res) => {
  try {
    // Obten el ID de usuario desde el token
    const token = req.headers.authorization; // Supongamos que el token se encuentra en el encabezado Authorization

    if (token) {
      // Verifica y decodifica el token
      jwt.verify(token, "tu_clave_secreta", async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Token inválido" });
        }

        // El ID de usuario estará en el objeto decoded
        const userId = decoded.userId; // Ajusta esto según la estructura de tu token

        const { name } = req.body;
        const file = req.file.path;

        // Ahora puedes usar el ID de usuario para guardar el archivo asociado al usuario con el ID "userId"
        const item = await Item.create({ name, file, userId });

        res.status(201).json({ item });
      });
    } else {
      res.status(401).json({ message: "Token no proporcionado" });
    }
  } catch (error) {
    console.log(error);
  }
});

const downloadFile = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    return next(new Error("No item found"));
  }
  const file = item.file;
  const filePath = path.join(__dirname, `../${file}`);
  res.download(filePath);
});

module.exports = {
  getItems,
  addItem,
  downloadFile,
};