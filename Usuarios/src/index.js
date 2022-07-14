import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { databaseConnect } from "./data/conexao.js";
import { usuariosRoute } from "./routes/usuarios.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

app.use(cors());

databaseConnect();
app.use("/usuarios", usuariosRoute);
app.use(notFound);

app.listen(3002, () => console.log("Server on-line. Listen on port 3002"));
