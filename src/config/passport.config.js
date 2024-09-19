import passport from "passport";
import jwt from "passport-jwt";
import config from "./config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const COOKIE_NAME = config.COOKIE_NAME;
const JWT_SECRET = config.JWT_SECRET;

const initializePassport = () => {

  const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[COOKIE_NAME];
    }
    return token;
  }

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }));
}

export default initializePassport;
