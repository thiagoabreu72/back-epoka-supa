const responseUtil = require('../utils/response.util');

class ValidationMiddleware {
  validate(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return responseUtil.badRequest(res, 'Erro de validação', errors);
      }

      req.body = value;
      next();
    };
  }

  validateQuery(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return responseUtil.badRequest(res, 'Erro de validação nos parâmetros', errors);
      }

      req.query = value;
      next();
    };
  }

  validateParams(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return responseUtil.badRequest(res, 'Erro de validação nos parâmetros', errors);
      }

      req.params = value;
      next();
    };
  }
}

module.exports = new ValidationMiddleware();
