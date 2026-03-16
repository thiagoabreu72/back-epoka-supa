const tagPedagioRepository = require('../repositories/tagPedagio.repository');

class TagPedagioService {
  async getAll(filters, pagination) {
    return await tagPedagioRepository.findAll(filters, pagination);
  }

  async getById(id) {
    const tag = await tagPedagioRepository.findById(id);

    if (!tag) {
      throw new Error('Tag de pedágio não encontrada');
    }

    return tag;
  }

  async create(dados) {
    const tagExistente = await tagPedagioRepository.findByCodigoTag(dados.codigo_tag);

    if (tagExistente) {
      throw new Error('Já existe uma tag com este código');
    }

    return await tagPedagioRepository.create(dados);
  }

  async update(id, dados) {
    const tag = await tagPedagioRepository.findById(id);

    if (!tag) {
      throw new Error('Tag de pedágio não encontrada');
    }

    if (dados.codigo_tag && dados.codigo_tag !== tag.codigo_tag) {
      const codigoExistente = await tagPedagioRepository.findByCodigoTag(dados.codigo_tag);
      if (codigoExistente) {
        throw new Error('Já existe uma tag com este código');
      }
    }

    return await tagPedagioRepository.update(id, dados);
  }

  async delete(id) {
    const tag = await tagPedagioRepository.findById(id);

    if (!tag) {
      throw new Error('Tag de pedágio não encontrada');
    }

    return await tagPedagioRepository.delete(id);
  }
}

module.exports = new TagPedagioService();
