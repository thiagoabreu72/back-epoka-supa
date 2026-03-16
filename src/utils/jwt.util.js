const jwt = require('jsonwebtoken');
const env = require('../config/env');

class JwtUtil {
  generateAccessToken(payload) {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.jwt.secret);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, env.jwt.refreshSecret);
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JwtUtil();
