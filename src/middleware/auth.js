// Verificación de que si el usuario posee rol de Admin
export function soloAdmin(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Acceso denegado. No tienes rol de Administrador.");
  }
}

// Verificación de que si el usuario posee rol de Usuario Normal
export function soloUser(req, res, next) {
  if (req.user.role === "user") {
    next();
  } else {
    res.status(403).send("Acceso denegado. No tienes rol de Usuario Normal.");
  }
}
