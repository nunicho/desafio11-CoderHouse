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

  let sortQuery = {}; // Inicializa el objeto de consulta de ordenamiento vacío

  if (sortOption === "price_asc") {
    // Si el usuario selecciona orden ascendente por precio
    sortQuery = { price: 1 };
  } else if (sortOption === "price_desc") {
    // Si el usuario selecciona orden descendente por precio
    sortQuery = { price: -1 };
  }

  let productos = await productosModelo.paginate(query, {
    limit: limit, // Aplica el límite según el valor de "limit"
    lean: true,
    page: pagina,
    sort: sortQuery, // Aplica el ordenamiento según el valor de sortQuery
  });

  let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productos;

  res.header("Content-type", "text/html");
  res.status(200).render("DBproducts", {
    productos: productos.docs,
    hasProducts: productos.docs.length > 0,
    //activeProduct: true,
    status: productos.docs.status,
    pageTitle: "Productos en DATABASE",
    estilo: "productsStyles.css",
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    filtro: filtroTitle || "",
    codeFilter: filtroCode || "",
    sort: sortOption || "", // Establece el valor del campo de ordenamiento en la vista
    limit: limit, // Pasa el límite a la vista
  });
} catch (error) {
  res.status(500).json({ error: "Error interno del servidor" });
}
};

const crearProducto = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }
    const productoNuevo = new productosModelo(req.body);
    await productoNuevo.save();
    res.status(201).json({
      mensaje: "El producto fue correctamente creado",
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al intentar agregar un producto",
    });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const productoBuscado = await productosModelo.findById(req.params.id);
    res.status(200).json(productoBuscado);
  } catch (error) {
    res.status(404).json({
      mensaje: "Error no se pudo encontrar el producto",
    });
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

/*
const listarProductosConFiltrosYOrden = async (req, res) => {
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
      sortQuery = { price: 1 };
    } else if (sortOption === "price_desc") {
      sortQuery = { price: -1 };
    }

    let productos = await productosModelo.paginate(query, {
      limit: limit,
      lean: true,
      page: pagina,
      sort: sortQuery,
    });

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;

    res.header("Content-type", "text/html");
    res.status(200).render("DBproducts", {
      productos: productos.docs,
      hasProducts: productos.docs.length > 0,
      status: productos.docs.status,
      pageTitle: "Productos en DATABASE",
      estilo: "productsStyles.css",
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      filtro: filtroTitle || "",
      codeFilter: filtroCode || "",
      sort: sortOption || "",
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

*/

module.exports = {
  listarProductos,
  crearProducto,
  obtenerProducto,
  editarProducto,
  borrarProducto, 
};
