const usuarioService = require("../services/usuario.service");
const responseUtil = require("../utils/response.util");
const usuarioRepository = require("../repositories/usuario.repository");

class UsuarioController {
  async listarTodosPublico(req, res, next) {
    try {
      // Busca todos os usuários sem filtros
      const usuarios = await usuarioRepository.findAllPublico();

      return responseUtil.success(
        res,
        usuarios,
        "Usuários listados com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }

  // Mantém o método original com paginação (se precisar)
  async listarTodos(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await usuarioRepository.findAll({}, { page, limit });

      return responseUtil.success(res, result, "Usuários listados com sucesso");
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const filters = {
        ativo: req.query.ativo,
        perfil_id: req.query.perfil_id,
        search: req.query.search,
      };

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const resultado = await usuarioService.getAll(filters, pagination);

      return responseUtil.success(res, resultado);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const usuario = await usuarioService.getById(req.params.id);

      return responseUtil.success(res, usuario);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const usuario = await usuarioService.create(req.body);

      return responseUtil.created(res, usuario, "Usuário criado com sucesso");
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const usuario = await usuarioService.update(req.params.id, req.body);

      return responseUtil.success(
        res,
        usuario,
        "Usuário atualizado com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await usuarioService.delete(req.params.id);

      return responseUtil.success(res, null, "Usuário excluído com sucesso");
    } catch (error) {
      next(error);
    }
  }

  async inactivate(req, res, next) {
    try {
      const usuario = await usuarioService.inactivate(req.params.id);

      return responseUtil.success(
        res,
        usuario,
        "Usuário inativado com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuarioController();
