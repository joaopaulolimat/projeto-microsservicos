import { Router } from "express";
import { Usuario } from "../model/usuario.js";
import * as bcrypt from "bcrypt";
import { gerarToken } from "../utils/gerarToken.js";
import { verificaToken } from "../middleware/verificaToken.js";
import { config } from "../config/settings.js";
import { v4 as uuidv4 } from "uuid";

const usuariosRoute = Router();

usuariosRoute.get("/", (req, res) => {
  Usuario.find((erro, result) => {
    if (erro) {
      return res
        .status(500)
        .send({ output: `Erro ao processar o pedido -> ${erro}` });
    }

    res.status(200).send({ output: "Ok", payload: result });
  });
});

usuariosRoute.post("/", (req, res) => {
  bcrypt.hash(req.body.senha, config.bcryptSalt, (erro, result) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao tentar gerar a senha: ${erro}` });

    req.body.senha = result;
    req.body.apikey = uuidv4();

    const usuario = new Usuario(req.body);
    usuario
      .save()
      .then((result) => {
        res.status(201).send({ output: "Cadastrado", payload: result });
      })
      .catch((erro) => {
        res.status(500).send({ output: `Erro ao cadastrar: ${erro}` });
      });
  });
});

usuariosRoute.post("/login", (req, res) => {
  Usuario.findOne({ nomeusuario: req.body.nomeusuario }, (erro, result) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao tentar localizar: ${erro}` });
    if (!result)
      return res.status(400).send({ output: `Usuário não localizado` });

    bcrypt.compare(req.body.senha, result.senha, (erro, same) => {
      if (erro)
        return res
          .status(500)
          .send({ output: `Erro ao validar a senha: ${erro}` });
      if (!same) return res.status(400).send({ output: `Senha inválida` });

      const token = gerarToken(result._id, result.nomeusuario, result.email);
      if (token) return res.status(200).send({ output: "Autenticado", token });
    });
  });
});

usuariosRoute.put("/:id", verificaToken, (req, res) => {
  Usuario.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (erro, dados) => {
      if (erro) {
        return res.status(500).send({ output: `Erro ao cadastrar -> ${erro}` });
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

usuariosRoute.put("/atualizaSenha/:id", verificaToken, (req, res) => {
  bcrypt.hash(req.body.senha, config.bcryptSalt, (erro, result) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Erro ao tentar atualizar a senha: ${erro}` });

    req.body.senha = result;

    Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (erro, dados) => {
        if (erro) {
          return res
            .status(500)
            .send({ output: `Erro ao atualizar senha -> ${erro}` });
        }
        if (!dados) {
          return res
            .status(400)
            .send({ output: `Não foi possível atualizar -> ${erro}` });
        }
        return res
          .status(200)
          .send({ output: "Senha atualizada", payload: dados });
      }
    );
  });
});

usuariosRoute.delete("/:id", (req, res) => {
  Usuario.findByIdAndDelete(req.params.id, (erro, dados) => {
    if (erro)
      return res
        .status(500)
        .send({ output: `Não foi possível apagar -> ${erro}` });
    res.status(204).send({});
  });
});

export { usuariosRoute };
