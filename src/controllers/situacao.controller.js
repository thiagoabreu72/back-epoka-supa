const situacaoService = require('../services/situacao.service');
const responseUtil = require('../utils/response.util');

class SituacaoController {
  async index(req, res, next) {
    try {
      const situacoes = await situacaoService.getAll();

      return responseUtil.success(res, situacoes);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const situacao = await situacaoService.getById(req.params.id);

      return responseUtil.success(res, situacao);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const situacao = await situacaoService.create(req.body);

      return responseUtil.created(res, situacao, 'Situação criada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const situacao = await situacaoService.update(req.params.id, req.body);

      return responseUtil.success(res, situacao, 'Situação atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await situacaoService.delete(req.params.id);

      return responseUtil.success(res, null, 'Situação excluída com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SituacaoController();
