const usuarioRepository = require("../repositories/usuario.repository");
const perfilRepository = require("../repositories/perfil.repository");
const passwordUtil = require("../utils/password.util");
const jwtUtil = require("../utils/jwt.util");

class AuthService {
  async login(email, senha) {
    // Validações básicas
    if (!email || !senha) {
      const error = new Error("Email e senha são obrigatórios");
      error.statusCode = 400;
      throw error;
    }

    // Busca usuário
    const usuario = await usuarioRepository.findByEmail(
      email.toLowerCase().trim(),
    );

    if (!usuario) {
      const error = new Error("Credenciais inválidas");
      error.statusCode = 401;
      throw error;
    }

    // Verifica se está ativo
    if (!usuario.ativo) {
      const error = new Error("Usuário inativo");
      error.statusCode = 403;
      throw error;
    }

    // Verifica se tem senha_hash
    if (!usuario.senha_hash) {
      console.error("Usuário sem senha_hash:", usuario.id);
      const error = new Error("Erro na configuração da conta");
      error.statusCode = 500;
      throw error;
    }

    // Compara senhas
    const senhaValida = await passwordUtil.comparePassword(
      senha,
      usuario.senha_hash,
    );

    if (!senhaValida) {
      const error = new Error("Credenciais inválidas");
      error.statusCode = 401;
      throw error;
    }

    // Gera tokens
    const payload = {
      id: usuario.id,
      email: usuario.email,
      perfil_id: usuario.perfil_id,
      perfil_nome: usuario.perfil.nome,
    };

    const accessToken = jwtUtil.generateAccessToken(payload);
    const refreshToken = jwtUtil.generateRefreshToken({ id: usuario.id });

    // Remove senha do retorno
    const { senha_hash, ...usuarioSemSenha } = usuario;

    return {
      usuario: usuarioSemSenha,
      accessToken,
      refreshToken,
    };
  }

  async register(dados) {
    const usuarioExistente = await usuarioRepository.findByEmail(dados.email);

    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }

    const perfilExistente = await perfilRepository.findById(dados.perfil_id);

    if (!perfilExistente) {
      throw new Error("Perfil não encontrado");
    }

    const senhaHash = await passwordUtil.hashPassword(dados.senha);

    const usuario = await usuarioRepository.create({
      ...dados,
      senha_hash: senhaHash,
    });

    return usuario;
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwtUtil.verifyRefreshToken(refreshToken);

      const usuario = await usuarioRepository.findById(decoded.id);

      if (!usuario || !usuario.ativo) {
        throw new Error("Usuário inválido ou inativo");
      }

      const payload = {
        id: usuario.id,
        email: usuario.email,
        perfil_id: usuario.perfil_id,
        perfil_nome: usuario.perfil.nome,
      };

      const newAccessToken = jwtUtil.generateAccessToken(payload);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error("Refresh token inválido");
    }
  }
}

module.exports = new AuthService();
