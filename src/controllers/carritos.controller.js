const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
const mongoose = require("mongoose");

const obtenerCarrito = async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo ObjectId válido',
      });
    }

    const carritoDB = await carritosModelo
      .findOne({ _id: cid })
      .populate({
        path: "productos.producto",
        model: prodModelo,
      })
      .lean();

    if (!carritoDB) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }

    // Devuelve solo los datos del carrito sin preocuparte por el renderizado.
    return res.status(200).json({ carritoDB });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerCarrito,
};