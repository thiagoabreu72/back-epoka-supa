class ResponseUtil {
  success(res, data = null, message = 'Operação realizada com sucesso', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  error(res, message = 'Erro na operação', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  created(res, data = null, message = 'Recurso criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  badRequest(res, message = 'Requisição inválida', errors = null) {
    return this.error(res, message, 400, errors);
  }

  unauthorized(res, message = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  forbidden(res, message = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  notFound(res, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  conflict(res, message = 'Conflito de dados') {
    return this.error(res, message, 409);
  }

  serverError(res, message = 'Erro interno do servidor') {
    return this.error(res, message, 500);
  }
}

module.exports = new ResponseUtil();
