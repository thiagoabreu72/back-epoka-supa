const tagPedagioService = require('../services/tagPedagio.service');
const responseUtil = require('../utils/response.util');

class TagPedagioController {
  async index(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        operadora: req.query.operadora,
        codigo_tag: req.query.codigo_tag
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const resultado = await tagPedagioService.getAll(filters, pagination);

      return responseUtil.success(res, resultado);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const tag = await tagPedagioService.getById(req.params.id);

      return responseUtil.success(res, tag);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const tag = await tagPedagioService.create(req.body);

      return responseUtil.created(res, tag, 'Tag de pedágio criada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const tag = await tagPedagioService.update(req.params.id, req.body);

      return responseUtil.success(res, tag, 'Tag de pedágio atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await tagPedagioService.delete(req.params.id);

      return responseUtil.success(res, null, 'Tag de pedágio excluída com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TagPedagioController();
