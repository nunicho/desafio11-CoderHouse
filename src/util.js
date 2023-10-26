const { fileURLToPath } = require("url");
const { dirname } = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { nextTick } = require("process");

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

const generaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const validaHash = (usuario, password) =>
  bcrypt.compareSync(password, usuario.password);

const passportCall = (estrategia) => {
  return async function (req, res, next) {
    passport.authenticate(estrategia, function (err, usuario, info) {
      if (err) return next(err);
      if (!usuario) {
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString(),
          detalle: info.detalle ? info.detalle : " - ",
        });
      }
      req.user = usuario;
      return next();
    })(req, res, next);
  };
};

module.exports = {
  __dirname,
  generaHash,
  validaHash,
  passportCall,
};
