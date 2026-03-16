const logAlteracaoRepository = require('../repositories/logAlteracao.repository');

class LoggerMiddleware {
  async logAlteracao(tabela, registroId, usuarioId, acao, dadosAnteriores = null, dadosNovos = null) {
    try {
      await logAlteracaoRepository.create({
        tabela,
        registro_id: registroId,
        usuario_id: usuarioId,
        acao,
        dados_anteriores: dadosAnteriores,
        dados_novos: dadosNovos
      });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  }

  createLogger(tabela) {
    return async (req, res, next) => {
      const originalJson = res.json.bind(res);

      res.json = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const acao = req.method === 'POST' ? 'CREATE' : 
                       req.method === 'PUT' || req.method === 'PATCH' ? 'UPDATE' : 
                       req.method === 'DELETE' ? 'DELETE' : null;

          if (acao && req.usuarioId) {
            const registroId = data.data?.id || req.params.id;
            
            LoggerMiddleware.prototype.logAlteracao(
              tabela,
              registroId,
              req.usuarioId,
              acao,
              req.dadosAnteriores || null,
              data.data || null
            );
          }
        }

        return originalJson(data);
      };

      next();
    };
  }
}

module.exports = new LoggerMiddleware();
