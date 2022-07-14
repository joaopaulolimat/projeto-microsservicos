import { Router } from "express";
import { DadosFinanceiros } from "../model/dadosFinanceiros.js";
import { verificaToken } from "../middleware/verificaToken.js";
import { v4 as uuidv4 } from "uuid";

const financeiroRoute = Router();

financeiroRoute.get("/", verificaToken, (req, res) => {
  DadosFinanceiros.find((erro, result) => {
    if (erro) {
      return res
        .status(500)
        .send({ output: `Erro ao processar o pedido -> ${erro}` });
    }

    res.status(200).send({ output: "Ok", payload: result });
  });
});

financeiroRoute.post("/", verificaToken, (req, res) => {
  req.body.apikey = uuidv4();

  const usuario = new DadosFinanceiros(req.body);
  usuario
    .save()
    .then((result) => {
      res.status(201).send({ output: "Cadastrado", payload: result });
    })
    .catch((erro) => {
      res.status(500).send({ output: `Erro ao cadastrar: ${erro}` });
    });
});

financeiroRoute.put("/:id", verificaToken, (req, res) => {
  DadosFinanceiros.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (erro, dados) => {
      if (erro) {
        return res.status(500).send({ output: `Erro ao atualizar -> ${erro}` });
      }
      if (!dados) {
        return res
          .status(400)
          .send({ output: `Não foi possível atualizar -> ${erro}` });
      }
      return res.status(200).send({ output: "Atualizado", payload: dados });
    }
  );
});

export { financeiroRoute };
