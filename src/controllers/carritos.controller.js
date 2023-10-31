const carritosModelo = require("../dao/DB/models/carritos.modelo.js");
const prodModelo = require("../dao/DB/models/productos.modelo.js")
const mongoose = require("mongoose");

const obtenerCarrito = async (req, res, next) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        status: "error",
        mensaje: 'Requiere un argumento "cid" de tipo ObjectId válido',
      });
    }

    const carrito = await carritosModelo
      .findOne({ _id: cid })
      .populate({
        path: "productos.producto",
        model: prodModelo,
      })
      .lean();

    if (!carrito) {
      return res.status(404).json({
        status: "error",
        mensaje: `El carrito con ID ${cid} no existe`,
      });
    }    
    res.locals.carritoDB = carrito;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerCarrito,
};


