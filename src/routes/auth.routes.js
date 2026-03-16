const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const authValidator = require('../validators/auth.validator');

router.post('/login', 
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login de usuário'
  // #swagger.description = 'Endpoint para realizar login na API'
  validationMiddleware.validate(authValidator.login),
  authController.login
);

router.post('/register',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Registrar novo usuário'
  validationMiddleware.validate(authValidator.register),
  authController.register
);

router.post('/refresh-token',
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Renovar token de acesso'
  authController.refreshToken
);

router.get('/me', 
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Obter dados do usuário autenticado'
  // #swagger.security = [{ "bearerAuth": [] }]
  authMiddleware.authenticate,
  authController.me
);

module.exports = router;
