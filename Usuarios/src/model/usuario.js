import mongoose from "mongoose";

const schema = new mongoose.Schema({
  nomeusuario: { type: String, require: true, unique: true },
  email: { type: String, require: true },
  senha: { type: String, require: true },
  nomecompleto: { type: String, require: true },
  telefone: { type: String, require: true },
  datacadastro: { type: Date, default: Date.now() },
});

const Usuario = mongoose.model("usuario", schema);

export { Usuario };
