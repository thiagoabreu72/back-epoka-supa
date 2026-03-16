const ordemTransporteRepository = require('../repositories/ordemTransporte.repository');

class DashboardService {
  async getOrdensDetalhadasPorEmbarcador(dataInicio, dataFim, usuarioLogado) {
    return await ordemTransporteRepository.getOrdensDetalhadasPorEmbarcador(
      dataInicio,
      dataFim,
      usuarioLogado
    );
  }

  async getOrdensDetalhadasPorManifestador(dataInicio, dataFim, usuarioLogado) {
    return await ordemTransporteRepository.getOrdensDetalhadasPorManifestador(
      dataInicio,
      dataFim,
      usuarioLogado
    );
  }
}

module.exports = new DashboardService();
