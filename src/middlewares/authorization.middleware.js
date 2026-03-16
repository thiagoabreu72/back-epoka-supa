const responseUtil = require("../utils/response.util");

class AuthorizationMiddleware {
  requireRole(rolesPermitidos) {
    return (req, res, next) => {
      const roles = Array.isArray(rolesPermitidos)
        ? rolesPermitidos
        : [rolesPermitidos];

      if (!req.perfilNome || !roles.includes(req.perfilNome)) {
        return responseUtil.forbidden(
          res,
          "Você não tem permissão para acessar este recurso"
        );
      }

      next();
    };
  }

  requirePermission(recurso, acao) {
    return (req, res, next) => {
      if (!req.permissoes) {
        return responseUtil.forbidden(res, "Permissões não definidas");
      }

      const permissao = req.permissoes[recurso];

      if (!permissao || !permissao[acao]) {
        return responseUtil.forbidden(
          res,
          `Você não tem permissão para ${acao} em ${recurso}`
        );
      }

      next();
    };
  }

  isAdmin() {
    return this.requireRole("Admin");
  }

  isEmbarcador() {
    return this.requireRole("Embarcador");
  }

  isManifestador() {
    return this.requireRole("Manifestador");
  }

  isEmbarcadorOrAdmin() {
    return this.requireRole(["Embarcador", "Admin"]);
  }

  isManifestadorOrAdmin() {
    return this.requireRole(["Manifestador", "Admin"]);
  }
}

module.exports = new AuthorizationMiddleware();
