import jwt from "jsonwebtoken";
import { config } from "../config/settings.js";

export const gerarToken = (id, nomeusuario, email) => {
  return jwt.sign({ id, nomeusuario, email }, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  });
};
