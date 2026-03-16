const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizationMiddleware = require("../middlewares/authorization.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const usuarioValidator = require("../validators/usuario.validator");
const commonValidator = require("../validators/common.validator");

router.use(authMiddleware.authenticate);


router.get('/usuarios', usuarioController.listarTodosPublico);

router.get(
  "/",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Listar todos os usuários'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  usuarioController.index,
);

router.get(
  "/:id",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Buscar usuário por ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  usuarioController.show,
);

router.post(
  "/",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Criar novo usuário'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validate(usuarioValidator.create),
  usuarioController.store,
);

router.put(
  "/:id",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Atualizar usuário'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  validationMiddleware.validate(usuarioValidator.update),
  usuarioController.update,
);

router.patch(
  "/:id/inactivate",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Inativar usuário'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  usuarioController.inactivate,
);

router.delete(
  "/:id",
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Excluir usuário'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.isAdmin(),
  validationMiddleware.validateParams(commonValidator.id),
  usuarioController.destroy,
);

module.exports = router;
