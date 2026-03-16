const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizationMiddleware = require('../middlewares/authorization.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const commonValidator = require('../validators/common.validator');

router.use(authMiddleware.authenticate);

router.get('/',
  // #swagger.tags = ['Perfis']
  // #swagger.summary = 'Listar perfis'
  // #swagger.security = [{ "bearerAuth": [] }]
  perfilController.index
);

router.get('/:id',
  // #swagger.tags = ['Perfis']
  // #swagger.summary = 'Buscar perfil por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  validationMiddleware.validateParams(commonValidator.id),
  perfilController.show
);

router.post('/',
  // #swagger.tags = ['Perfis']
  // #swagger.summary = 'Criar perfil'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  perfilController.store
);

router.put('/:id',
  // #swagger.tags = ['Perfis']
  // #swagger.summary = 'Atualizar perfil'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  perfilController.update
);

router.delete('/:id',
  // #swagger.tags = ['Perfis']
  // #swagger.summary = 'Excluir perfil'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  perfilController.destroy
);

module.exports = router;
