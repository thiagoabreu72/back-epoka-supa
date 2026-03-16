const express = require('express');
const router = express.Router();
const tagPedagioController = require('../controllers/tagPedagio.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const commonValidator = require('../validators/common.validator');
const loggerMiddleware = require('../middlewares/logger.middleware');

router.use(authMiddleware.authenticate);

router.get('/',
  // #swagger.tags = ['Tags de Pedágio']
  // #swagger.summary = 'Listar tags de pedágio'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'visualizar'),
  tagPedagioController.index
);

router.get('/:id',
  // #swagger.tags = ['Tags de Pedágio']
  // #swagger.summary = 'Buscar tag por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'visualizar'),
  validationMiddleware.validateParams(commonValidator.id),
  tagPedagioController.show
);

router.post('/',
  // #swagger.tags = ['Tags de Pedágio']
  // #swagger.summary = 'Criar tag de pedágio'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'criar'),
  loggerMiddleware.createLogger('tags_pedagio'),
  tagPedagioController.store
);

router.put('/:id',
  // #swagger.tags = ['Tags de Pedágio']
  // #swagger.summary = 'Atualizar tag de pedágio'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'editar'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('tags_pedagio'),
  tagPedagioController.update
);

router.delete('/:id',
  // #swagger.tags = ['Tags de Pedágio']
  // #swagger.summary = 'Excluir tag de pedágio'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'excluir'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('tags_pedagio'),
  tagPedagioController.destroy
);

module.exports = router;
