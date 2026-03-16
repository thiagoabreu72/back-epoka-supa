const tipoCargaRepository = require('../repositories/tipoCarga.repository');

class TipoCargaService {
  async getAll() {
    return await tipoCargaRepository.findAll();
  }

  async getById(id) {
    const tipo = await tipoCargaRepository.findById(id);

    if (!tipo) {
      throw new Error('Tipo de carga não encontrado');
    }

    return tipo;
  }

  async create(dados) {
    return await tipoCargaRepository.create(dados);
  }

  async update(id, dados) {
    const tipo = await tipoCargaRepository.findById(id);

    if (!tipo) {
      throw new Error('Tipo de carga não encontrado');
    }

    return await tipoCargaRepository.update(id, dados);
  }

  async delete(id) {
    const tipo = await tipoCargaRepository.findById(id);

    if (!tipo) {
      throw new Error('Tipo de carga não encontrado');
    }

    return await tipoCargaRepository.delete(id);
  }
}

module.exports = new TipoCargaService();
