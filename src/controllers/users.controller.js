
const modeloUsers = require("../dao/DB/models/users.modelo.js");
const util = require("../util.js");


const usersController = {
  registro: async (req, done) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      if (!first_name || !last_name || !age || !email || !password) {
        return done(null, false, {
          message: "Por favor, complete todos los campos",
        });
      }

      // Añadir validación para age
      let age2 = parseInt(age); // Convertir age a número
      if (isNaN(age2) || age2 <= 13 || age2 >= 120) {
        return done(null, false, {
          message: "La edad debe ser mayor a 13 y menor a 120",
        });
      }

      const cartId = generateCustomCartId();

      const usuario = await modeloUsers.create({
        first_name,
        last_name,
        email,
        age,
        password: util.generaHash(password),
        cart: cartId,
        role: "user",
      });

      return done(null, usuario);
    } catch (error) {
      return done(error, false, {
        message: "Ocurrió un error durante el registro.",
      });
    }
  },
};



module.exports = usersController;
