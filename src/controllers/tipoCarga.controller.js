const tipoCargaService = require('../services/tipoCarga.service'); // Troque pelo caminho correto do seu service
const responseUtil = require('../utils/response.util');

class TipoCargaController {
  async index(req, res, next) {
    try {
      const tiposCarga = await tipoCargaService.getAll();
      return responseUtil.success(res, tiposCarga);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const tipoCarga = await tipoCargaService.getById(req.params.id);
      return responseUtil.success(res, tipoCarga);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const tipoCarga = await tipoCargaService.create(req.body);
      return responseUtil.created(res, tipoCarga, 'Tipo de carga criado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const tipoCarga = await tipoCargaService.update(req.params.id, req.body);
      return responseUtil.success(res, tipoCarga, 'Tipo de carga atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await tipoCargaService.delete(req.params.id);
      return responseUtil.success(res, null, 'Tipo de carga excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TipoCargaController();