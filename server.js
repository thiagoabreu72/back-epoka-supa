const app = require('./src/app');
const env = require('./src/config/env');
const supabase = require('./src/config/supabase');

const PORT = env.port;

async function startServer() {
  try {
    // Testar conexão com o Supabase
    const { error } = await supabase.from('perfis').select('id').limit(1);
    if (error) throw error;
    console.log('✓ Conexão com o Supabase estabelecida com sucesso');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ Ambiente: ${env.node_env}`);
      console.log(`✓ API URL: http://localhost:${PORT}/api/${env.api_version}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown (Supabase usa HTTP, não há conexão persistente para fechar)
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor gracefully...');
  process.exit(0);
});

startServer();
