const productosModelo = require("../dao/DB/models/productos.modelo.js");
const mongoose = require("mongoose");





const listarProductos = async (req, res) => {
  try {
    let pagina = req.query.pagina || 1;
    let filtroTitle = req.query.filtro;
    let filtroCode = req.query.codeFilter;
    let sortOption = req.query.sort;
    let limit = parseInt(req.query.limit) || 10;

    let query = {};

    if (filtroTitle && filtroCode) {
      query = {
        $or: [
          { title: { $regex: filtroTitle, $options: "i" } },
          { code: { $regex: filtroCode, $options: "i" } },
        ],
      };
    } else if (filtroTitle) {
      query = { title: { $regex: filtroTitle, $options: "i" } };
    } else if (filtroCode) {
      query = { code: { $regex: filtroCode, $options: "i" } };
    }

    let sortQuery = {};

    if (sortOption === "price_asc") {
      sortQuery.price = 1;
    } else if (sortOption === "price_desc") {
      sortQuery.price = -1;
    }

    const productos = await productosModelo.paginate(query, {
      limit: limit,
      lean: true,
      page: pagina,
      sort: sortQuery,
    });

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;

    return productos; // Devolvemos los productos
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerProducto = async (req, res, next) => {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "id inválido" });
    let productoDB = await productosModelo.findById(id).lean();
    if (!productoDB)
      return res
        .status(404)
        .json({ error: `Producto con id ${id} inexistente` });

    res.locals.productoDB = productoDB; // Almacena el producto en res.locals
    next(); // Llama a la siguiente función middleware
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};



const crearProducto = async (req, res) => {
  try {
    const producto = req.body;

    if (
      !producto.title ||
      !producto.description ||
      !producto.price ||
      !producto.thumbnail ||
      !producto.code ||
      !producto.stock
    ) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const existe = await productosModelo.findOne({ code: producto.code });
    if (existe) {
      return res.status(400).json({
        error: `El código ${producto.code} ya está siendo usado por otro producto.`,
      });
    }

    const productoInsertado = await productosModelo.create(producto);
    res.status(201).json({ productoInsertado });
  } catch (error) {
    res.status(500).json({ error: "Error inesperado", detalle: error.message });
  }
};



const editarProducto = async (req, res) => {
  try {
    await productosModelo.findByIdAndUpdate(req.params.id, req.body);
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }
    res.status(200).json({
      mensaje: "El producto fue editado correctamente",
    });
  } catch (error) {
    res.status(404).json({
      mensaje: "Error, el producto solicitado no pudo ser modificado",
    });
  }
};

const borrarProducto = async (req, res) => {
  try {
    await productosModelo.findByIdAndDelete(req.params.id);
    res.status(200).json({
      mensaje: "El producto fue correctamente eliminado",
    });
  } catch (error) {
    res.status(404).json({
      mensaje: "Error, el producto solicitado no pudo ser eliminado",
    });
  }
};



module.exports = {
  listarProductos,
  crearProducto,
  obtenerProducto,
  editarProducto,
  borrarProducto, 
};
