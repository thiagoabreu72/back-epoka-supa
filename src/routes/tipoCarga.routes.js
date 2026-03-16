const express = require('express');
const router = express.Router();
const tipoCargaController = require('../controllers/tipoCarga.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const commonValidator = require('../validators/common.validator');
const loggerMiddleware = require('../middlewares/logger.middleware');

router.use(authMiddleware.authenticate);

router.get('/',
  // #swagger.tags = ['Tipos de Carga']
  // #swagger.summary = 'Listar tipos de carga'
  // #swagger.security = [{ "bearerAuth": [] }]
  tipoCargaController.index
);

router.get('/:id',
  // #swagger.tags = ['Tipos de Carga']
  // #swagger.summary = 'Buscar tipo de carga por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  validationMiddleware.validateParams(commonValidator.id),
  tipoCargaController.show
);

router.post('/',
  // #swagger.tags = ['Tipos de Carga']
  // #swagger.summary = 'Criar tipo de carga'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'criar'),
  loggerMiddleware.createLogger('tipos_carga'),
  tipoCargaController.store
);

router.put('/:id',
  // #swagger.tags = ['Tipos de Carga']
  // #swagger.summary = 'Atualizar tipo de carga'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'editar'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('tipos_carga'),
  tipoCargaController.update
);

router.delete('/:id',
  // #swagger.tags = ['Tipos de Carga']
  // #swagger.summary = 'Excluir tipo de carga'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission('cadastros', 'excluir'),
  validationMiddleware.validateParams(commonValidator.id),
  loggerMiddleware.createLogger('tipos_carga'),
  tipoCargaController.destroy
);

module.exports = router;
