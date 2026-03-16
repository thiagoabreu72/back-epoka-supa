const express = require('express');
const router = express.Router();
const ordemTransporteController = require('../controllers/ordemTransporte.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const ordemTransporteValidator = require('../validators/ordemTransporte.validator');
const commonValidator = require('../validators/common.validator');
const loggerMiddleware = require('../middlewares/logger.middleware');

router.use(authMiddleware.authenticate);

router.get('/',
  // #swagger.tags = ['Ordens']
  // #swagger.summary = 'Listar ordens de transporte'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('ordens', 'visualizar'),
  validationMiddleware.validateQuery(ordemTransporteValidator.filter),
  ordemTransporteController.index
);

router.get('/:id',
  // #swagger.tags = ['Ordens']
  // #swagger.summary = 'Buscar ordem por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('ordens', 'visualizar'),
  validationMiddleware.validateParams(commonValidator.id),
  ordemTransporteController.show
);

router.post('/',
  // #swagger.tags = ['Ordens']
  // #swagger.summary = 'Criar nova ordem'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('ordens', 'criar'),
  validationMiddleware.validate(ordemTransporteValidator.create),
  loggerMiddleware.createLogger('ordens_transporte'),
  ordemTransporteController.store
);

router.put('/:id',
  // #swagger.tags = ['Ordens']
  // #swagger.summary = 'Atualizar ordem'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('ordens', 'editar'),
  validationMiddleware.validateParams(commonValidator.id),
  validationMiddleware.validate(ordemTransporteValidator.update),
  loggerMiddleware.createLogger('ordens_transporte'),
  ordemTransporteController.update
);

router.delete('/:id',
  // #swagger.tags = ['Ordens']
  // #swagger.summary = 'Excluir ordem'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('ordens_transporte'),
  ordemTransporteController.destroy
);

module.exports = router;
