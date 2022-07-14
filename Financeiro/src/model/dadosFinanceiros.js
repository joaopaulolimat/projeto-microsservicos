import mongoose from "mongoose";

const schema = new mongoose.Schema({
  nome_banco: { type: String, require: true, unique: true },
  tipo_conta: { type: String, require: true },
  nome_titular: { type: String, require: true },
  limite_cartao: { type: String, require: true },
  apikey: { type: String, require: true },
});

const DadosFinanceiros = mongoose.model("dadosFinanceiros", schema);

export { DadosFinanceiros };
