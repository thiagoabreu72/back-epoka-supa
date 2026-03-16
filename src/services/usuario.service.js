const usuarioRepository = require("../repositories/usuario.repository");
const perfilRepository = require("../repositories/perfil.repository");
const passwordUtil = require("../utils/password.util");

class UsuarioService {
  async getAll(filters, pagination) {
    return await usuarioRepository.findAll(filters, pagination);
  }

  async getById(id) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  }

  async create(dados) {
    const usuarioExistente = await usuarioRepository.findByEmail(dados.email);

    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }

    const perfilExistente = await perfilRepository.findById(dados.perfil_id);

    if (!perfilExistente) {
      throw new Error("Perfil não encontrado");
    }

    const senhaHash = await passwordUtil.hashPassword(dados.senha);

    const{ senha, ...dadossemsenha } = dados;

    return await usuarioRepository.create({
      ...dadossemsenha,
      senha_hash: senhaHash,
    });
  }

  async update(id, dados) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (dados.email && dados.email !== usuario.email) {
      const emailExistente = await usuarioRepository.findByEmail(dados.email);
      if (emailExistente) {
        throw new Error("Email já cadastrado");
      }
    }

    if (dados.perfil_id) {
      const perfilExistente = await perfilRepository.findById(dados.perfil_id);
      if (!perfilExistente) {
        throw new Error("Perfil não encontrado");
      }
    }

    if (dados.senha) {
      dados.senha_hash = await passwordUtil.hashPassword(dados.senha);
      delete dados.senha;
    }

    return await usuarioRepository.update(id, dados);
  }

  async delete(id) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return await usuarioRepository.delete(id);
  }

  async inactivate(id) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return await usuarioRepository.inactivate(id);
  }
}

module.exports = new UsuarioService();
