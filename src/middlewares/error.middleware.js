const responseUtil = require("../utils/response.util");

class ErrorMiddleware {
  handle(err, req, res, next) {
    console.error("Error:", err);

    if (err.name === "SequelizeValidationError") {
      const errors = err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return responseUtil.badRequest(res, "Erro de validação", errors);
    }

    if (err.name === "SequelizeUniqueConstraintError") {
      const errors = err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} já está em uso`,
      }));
      return responseUtil.conflict(res, "Registro duplicado", errors);
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return responseUtil.badRequest(res, "Erro de integridade referencial");
    }

    if (err.name === "JsonWebTokenError") {
      return responseUtil.unauthorized(res, "Token inválido");
    }

    if (err.name === "TokenExpiredError") {
      return responseUtil.unauthorized(res, "Token expirado");
    }

    if (err.statusCode) {
      return responseUtil.error(res, err.message, err.statusCode);
    }

    return responseUtil.serverError(res, "Erro interno do servidor");
  }

  notFound(req, res) {
    return responseUtil.notFound(res, "Rota não encontrada");
  }
}

module.exports = new ErrorMiddleware();
