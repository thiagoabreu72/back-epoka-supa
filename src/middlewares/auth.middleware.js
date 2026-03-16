const jwtUtil = require('../utils/jwt.util');
const responseUtil = require('../utils/response.util');
const supabase = require('../config/supabase');

class AuthMiddleware {
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return responseUtil.unauthorized(res, 'Token não fornecido');
      }

      const parts = authHeader.split(' ');

      if (parts.length !== 2) {
        return responseUtil.unauthorized(res, 'Formato de token inválido');
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return responseUtil.unauthorized(res, 'Token mal formatado');
      }

      const decoded = jwtUtil.verifyAccessToken(token);

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, nome, email, telefone, ativo, perfil_id, perfil:perfis(id, nome, permissoes)')
        .eq('id', decoded.id)
        .single();

      if (error || !usuario) {
        return responseUtil.unauthorized(res, 'Usuário não encontrado');
      }

      if (!usuario.ativo) {
        return responseUtil.unauthorized(res, 'Usuário inativo');
      }

      req.usuario = usuario;
      req.usuarioId = usuario.id;
      req.perfilNome = usuario.perfil.nome;
      req.permissoes = usuario.perfil.permissoes;

      next();
    } catch (error) {
      return responseUtil.unauthorized(res, error.message);
    }
  }
}

module.exports = new AuthMiddleware();
