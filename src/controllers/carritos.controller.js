const carritosServices = require("../services/carritos.service.js");

const obtenerCarrito = async (req, res, next) => {
  try {
    await carritosServices.obtenerCarrito(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerCarrito,
};
