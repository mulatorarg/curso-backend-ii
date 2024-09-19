import UserService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";
import config from "../config/config.js";

const COOKIE_NAME = config.COOKIE_NAME;
const JWT_SECRET = config.JWT_SECRET;

class UserController {

  async register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;

    try {
      const user = await UserService.registerUser({ first_name, last_name, email, age, password });

      const token = jwt.sign({
        first_name: `${user.first_name}`,
        last_name: `${user.last_name}`,
        email: user.email,
        role: user.role,
        cart: user.cart_id,
      }, JWT_SECRET, { expiresIn: "1h" });

      res.cookie(COOKIE_NAME, token, { maxAge: 3600000, httOnly: true });
      res.redirect('/api/sessions/current');
    } catch (error) {
      res.status(500).send('Error al registrar el Usuario: ' + error);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserService.loginUser(email, password);
      const token = jwt.sign({
        first_name: `${user.first_name}`,
        last_name: `${user.last_name}`,
        email: user.email,
        role: user.role,
        cart: user.cart_id,
      }, JWT_SECRET, { expiresIn: "1h" });

      res.cookie(COOKIE_NAME, token, { maxAge: 3600000, httOnly: true });
      res.redirect('/api/sessions/current');
    } catch (error) {
      res.status(500).send('Error al iniciar sesión. ' + error);
    }
  }

  async current(req, res) {
    if (req.user) {
      //console.log('current', req.user);
      const userDTO = new UserDTO(req.user);
      res.render("home", { user: userDTO })
    } else {
      res.redirect('/login');
    }
  }

  async logout(req, res) {
    res.clearCookie(COOKIE_NAME);
    res.redirect("/login")
  }

}

export default new UserController();
