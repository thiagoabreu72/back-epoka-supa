const situacaoRepository = require('../repositories/situacao.repository');

class SituacaoService {
  async getAll() {
    return await situacaoRepository.findAll();
  }

  async getById(id) {
    const situacao = await situacaoRepository.findById(id);

    if (!situacao) {
      throw new Error('Situação não encontrada');
    }

    return situacao;
  }

  async create(dados) {
    return await situacaoRepository.create(dados);
  }

  async update(id, dados) {
    const situacao = await situacaoRepository.findById(id);

    if (!situacao) {
      throw new Error('Situação não encontrada');
    }

    return await situacaoRepository.update(id, dados);
  }

  async delete(id) {
    const situacao = await situacaoRepository.findById(id);

    if (!situacao) {
      throw new Error('Situação não encontrada');
    }

    return await situacaoRepository.delete(id);
  }
}

module.exports = new SituacaoService();
