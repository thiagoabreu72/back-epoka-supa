const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

router.use(authMiddleware.authenticate);

router.get(
  "/ordens-por-embarcador",
  // #swagger.tags = ['Dashboard']
  // #swagger.summary = 'Obter dados de ordens por embarcador'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission("dashboard", "visualizar"),
  dashboardController.ordensPerEmbarcador
);

router.get(
  "/ordens-por-manifestador",
  // #swagger.tags = ['Dashboard']
  // #swagger.summary = 'Obter dados de ordens por manifestador'
  // #swagger.security = [{ "bearerAuth": [] }]
  authorizationMiddleware.requirePermission("dashboard", "visualizar"),
  dashboardController.ordensPerManifestador
);

module.exports = router;
