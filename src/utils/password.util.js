const bcrypt = require('bcryptjs');
const env = require('../config/env');

class PasswordUtil {
  async hashPassword(password) {
    return await bcrypt.hash(password, env.bcrypt.rounds);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new PasswordUtil();
