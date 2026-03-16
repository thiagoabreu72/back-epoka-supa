require("dotenv").config();

module.exports = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  api_version: process.env.API_VERSION || "v1",

  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY, // service_role key (acesso total, só usar no backend)
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "https://front-epoka.vercel.app/",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
