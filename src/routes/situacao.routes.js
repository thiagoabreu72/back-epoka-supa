const express = require('express');
const router = express.Router();
const situacaoController = require('../controllers/situacao.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const commonValidator = require('../validators/common.validator');
const loggerMiddleware = require('../middlewares/logger.middleware');

router.use(authMiddleware.authenticate);

router.get('/',
  // #swagger.tags = ['Situações']
  // #swagger.summary = 'Listar situações'
  // #swagger.security = [{ "bearerAuth": [] }]
  situacaoController.index
);

router.get('/:id',
  // #swagger.tags = ['Situações']
  // #swagger.summary = 'Buscar situação por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  validationMiddleware.validateParams(commonValidator.id),
  situacaoController.show
);

router.post('/',
  // #swagger.tags = ['Situações']
  // #swagger.summary = 'Criar situação'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'criar'),
  loggerMiddleware.createLogger('situacoes'),
  situacaoController.store
);

router.put('/:id',
  // #swagger.tags = ['Situações']
  // #swagger.summary = 'Atualizar situação'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'editar'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('situacoes'),
  situacaoController.update
);

router.delete('/:id',
  // #swagger.tags = ['Situações']
  // #swagger.summary = 'Excluir situação'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'excluir'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('situacoes'),
  situacaoController.destroy
);

module.exports = router;
