const perfilService = require('../services/perfil.service');
const responseUtil = require('../utils/response.util');

class PerfilController {
  async index(req, res, next) {
    try {
      const perfis = await perfilService.getAll();

      return responseUtil.success(res, perfis);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const perfil = await perfilService.getById(req.params.id);

      return responseUtil.success(res, perfil);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const perfil = await perfilService.create(req.body);

      return responseUtil.created(res, perfil, 'Perfil criado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const perfil = await perfilService.update(req.params.id, req.body);

      return responseUtil.success(res, perfil, 'Perfil atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await perfilService.delete(req.params.id);

      return responseUtil.success(res, null, 'Perfil excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PerfilController();
