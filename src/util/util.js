import bcrypt from "bcrypt";
import passport from "passport";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };

// passportCall
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) {
        return next(error);
      }

      if (!user) {
        //return res.redirect("/login");
        return res.status(401).send({ error: info.message ? info.message : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next)
  }
}

// Middleware de autorizacion con passport:
export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      //return res.redirect("/login");
      return res.status(403).send({ error: "No estás autorizado para acceder a este recurso." });
    }
    next();
  }
}
