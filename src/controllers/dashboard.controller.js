const dashboardService = require('../services/dashboard.service');
const responseUtil = require('../utils/response.util');

class DashboardController {
  async ordensPerEmbarcador(req, res, next) {
    try {
      const { dataInicio, dataFim } = req.query;

      const resultado = await dashboardService.getOrdensDetalhadasPorEmbarcador(
        dataInicio,
        dataFim,
        req.usuario
      );

      return responseUtil.success(res, resultado);
    } catch (error) {
      next(error);
    }
  }

  async ordensPerManifestador(req, res, next) {
    try {
      const { dataInicio, dataFim } = req.query;

      const resultado = await dashboardService.getOrdensDetalhadasPorManifestador(
        dataInicio,
        dataFim,
        req.usuario
      );

      return responseUtil.success(res, resultado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
