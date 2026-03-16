const authService = require('../services/auth.service');
const responseUtil = require('../utils/response.util');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const resultado = await authService.login(email, senha);

      return responseUtil.success(res, resultado, 'Login realizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const usuario = await authService.register(req.body);

      return responseUtil.created(res, usuario, 'Usuário registrado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return responseUtil.badRequest(res, 'Refresh token não fornecido');
      }

      const resultado = await authService.refreshToken(refreshToken);

      return responseUtil.success(res, resultado, 'Token renovado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      return responseUtil.success(res, req.usuario, 'Dados do usuário autenticado');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
