const perfilRepository = require("../repositories/perfil.repository");

class PerfilService {
  async getAll() {
    return await perfilRepository.findAll();
  }

  async getById(id) {
    const perfil = await perfilRepository.findById(id);

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    return perfil;
  }

  async create(dados) {
    const perfilExistente = await perfilRepository.findByNome(dados.nome);

    if (perfilExistente) {
      throw new Error("Já existe um perfil com este nome");
    }

    return await perfilRepository.create(dados);
  }

  async update(id, dados) {
    const perfil = await perfilRepository.findById(id);

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    if (dados.nome && dados.nome !== perfil.nome) {
      const nomeExistente = await perfilRepository.findByNome(dados.nome);
      if (nomeExistente) {
        throw new Error("Já existe um perfil com este nome");
      }
    }

    return await perfilRepository.update(id, dados);
  }

  async delete(id) {
    const perfil = await perfilRepository.findById(id);

    if (!perfil) {
      throw new Error("Perfil não encontrado");
    }

    // Verificar se existem usuários com este perfil
    // Isso será validado pela constraint do banco

    return await perfilRepository.delete(id);
  }
}

module.exports = new PerfilService();
