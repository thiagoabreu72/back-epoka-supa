const express = require('express');
const router = express.Router();

// Import das rotas
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const perfilRoutes = require('./perfil.routes');
const tagPedagioRoutes = require('./tagPedagio.routes');
const situacaoRoutes = require('./situacao.routes');
const tipoCargaRoutes = require('./tipoCarga.routes');
const ordemTransporteRoutes = require('./ordemTransporte.routes');
const dashboardRoutes = require('./dashboard.routes');

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API TMS está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Registro de rotas
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/perfis', perfilRoutes);
router.use('/tags-pedagio', tagPedagioRoutes);
router.use('/situacoes', situacaoRoutes);
router.use('/tipos-carga', tipoCargaRoutes);
router.use('/ordens', ordemTransporteRoutes);
router.use('/dashboards', dashboardRoutes);

module.exports = router;
