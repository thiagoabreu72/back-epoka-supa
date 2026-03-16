const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const errorMiddleware = require("./middlewares/error.middleware");
const env = require("./config/env");

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.swagger();
    this.routes();
    this.errorHandling();
  }

  middlewares() {
    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: env.cors.origin,
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (env.node_env === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      message: {
        success: false,
        message: "Muitas requisições deste IP, tente novamente mais tarde",
      },
    });
    this.app.use("/api", limiter);

    // Request timestamp
    this.app.use((req, res, next) => {
      req.requestTime = new Date().toISOString();
      next();
    });
  }

  swagger() {
    try {
      const swaggerFile = require("../swagger-output.json");
      this.app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerFile, {
          customSiteTitle: "TMS API Documentation",
          customCss: ".swagger-ui .topbar { display: none }",
          swaggerOptions: {
            persistAuthorization: true,
          },
        })
      );
      console.log("✓ Swagger UI disponível em /api-docs");
    } catch (error) {
      console.log(error);
      console.log("⚠ Swagger não configurado. Execute: npm run swagger");
    }
  }

  routes() {
    // API routes
    this.app.use(`/api/${env.api_version}`, routes);

    // Root route
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "TMS API - Sistema de Controle de Ordens de Transporte",
        version: env.api_version,
        documentation: "/api/v1/health",
      });
    });
  }

  errorHandling() {
    // 404 handler
    this.app.use(errorMiddleware.notFound);

    // Global error handler
    this.app.use(errorMiddleware.handle);
  }
}

module.exports = new App().app;
