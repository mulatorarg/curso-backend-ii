import UserService from "../services/user.service.js";
import jwt from "jsonwebtoken";

class UserController {

  async register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;

    try {
      const nuevoUsuario = await UserService.registerUser({ first_name, last_name, email, age, password });

      const token = jwt.sign({
        usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role
      }, 'coderShopSecreto', { expiresIn: "1h" });

      res.cookie('coderShopToken', token, { maxAge: 3600000, httOnly: true });
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
        usuario: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }, 'coderShopSecreto', { expiresIn: "1h" });

      res.cookie('coderShopToken', token, { maxAge: 3600000, httOnly: true });
      res.redirect('/api/sessions/current');
    } catch (error) {
      res.status(500).send('Error al iniciar sesión. ' + error);
    }
  }

  async current(req, res) {
    if (req.user) {
      res.render('home', { user: req.user });
    } else {
      res.render('home');
    }
  }

  async logout(req, res) {
    res.clearCookie("coderShopToken");
    res.redirect("/login")
  }

}


export default new UserController();
